#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include "constans.h"
#include "i2c.h"
#include "serialize_frame.h"

void	read_frame(char *filename, bool **frame)
{
	FILE *f = fopen(filename, "rb");
	if (f == NULL)
		printf("File %s not found", filename);
	fseek(f, 0, SEEK_END);
	uint64_t fsize = ftell(f);
	fseek(f, 0, SEEK_SET);  /* same as rewind(f); */
	char *content = malloc(fsize * sizeof(char));
	fread(content, 1, fsize, f);
	for (uint64_t y = 0; y < fsize / X_SIZE; y++)
	{
		for (uint64_t x = 0; x < X_SIZE; x++)
		{
			char c = content[(y * X_SIZE) + x];
			if (c == '1')
				frame[y][x] = true;
			else if (c == '0')
				frame[y][x] = false;
			else
				printf("Unexpected character: \"%c\" at %llu/%llu\n", c, (y * X_SIZE) + x, fsize);
		}
	}
	free(content);
	fclose(f);
}

void	reset_frame_index(int32_t fd)
{
	uint8_t		buf[2];
	uint16_t	byte_pos_arduino;

	read_bytes(fd, buf, 2);
	byte_pos_arduino = 0;
	byte_pos_arduino += buf[0];
	byte_pos_arduino <<= 8;
	byte_pos_arduino += buf[1];
	printf("byte_pos_arduino {%u,%u} = %u\n", buf[0], buf[1], byte_pos_arduino);
	if (byte_pos_arduino != 0)
	{
		write_bytes(fd, buf, 1);
		reset_frame_index(fd);
	}
}

void	write_frame(int32_t fd, bool **frame, uint8_t *serialized_frame)
{
	reset_frame_index(fd);
	serialize_frame(frame, serialized_frame);
	write_bytes(fd, serialized_frame, NUM_SERIALIZED_BYTES);
}

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#include "constans.h"
#include "i2c.h"
#include "serialize_frame.h"
#include <wiringPi.h>
// #include "gpio.h"

char	*read_file(char *filename, uint64_t *fsize)
{
	FILE *f = fopen(filename, "rb");
	if (f == NULL)
		printf("File %s not found", filename);
	fseek(f, 0, SEEK_END);
	*fsize = ftell(f);
	fseek(f, 0, SEEK_SET);  /* same as rewind(f); */
	char *content = malloc(*fsize * sizeof(char));
	fread(content, 1, *fsize, f);
	fclose(f);
	return (content);
}

void	read_frame(char *filename, bool **frame)
{
	uint64_t	fsize;
	char *content = read_file(filename, &fsize);
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
}

void	reset_frame_index(int32_t fd)
{
	uint8_t	byte_pos_arduino;
	uint8_t	temp[2];

	byte_pos_arduino = 1;
	while (byte_pos_arduino != 0)
	{
		read_bytes(fd, &byte_pos_arduino, 1);
		printf("byte_pos_arduino %u\n", byte_pos_arduino);
		usleep(10000);
		write_bytes(fd, temp, 1);
	}
}

void	write_frame(int32_t fd, bool **frame, uint8_t *serialized_frame)
{
	// digitalWrite(RESET_PIN, 1);
	// usleep(1000);
	// digitalWrite(RESET_PIN, 0);
	// usleep(1000);
	serialize_frame(frame, serialized_frame);
	write_bytes(fd, serialized_frame, NUM_SERIALIZED_BYTES);
}

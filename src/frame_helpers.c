#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include "constans.h"

void	read_frame(char *filename, bool **frame)
{
	FILE *f = fopen(filename, "rb");
	if (f == NULL)
		printf("File %s not found", filename);
	fseek(f, 0, SEEK_END);
	uint64_t fsize = ftell(f);
	fseek(f, 0, SEEK_SET);  /* same as rewind(f); */
	char *content = malloc(fsize);
	for (uint64_t y = 0; y < fsize / X_SIZE; y++)
	{
		for (uint64_t x = 0; x < X_SIZE; x++)
		{
			if (content[y + x] == '1')
				frame[y][x] = true;
			else if (content[y + x] == '0')
				frame[y][x] = false;
		}
	}
	free(content);
	fclose(f);
}

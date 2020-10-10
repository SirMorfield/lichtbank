/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   main.c                                             :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 15:03:18 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 18:04:14 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#include "i2c.h"
#include "serialize_frame.h"
#include "constans.h"
#include "frame_helpers.h"

#include <time.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

bool	**alloc_matrix(uint64_t x_size, uint64_t y_size)
{
	bool **matrix;

	matrix = malloc(y_size * sizeof(bool *));
	while (y_size > 0)
	{
		y_size--;
		matrix[y_size] = malloc(x_size * sizeof(bool));
	}
	return (matrix);
}

int	main(void)
{
	int fd = open_i2c(0x04);
	bool **frame = alloc_matrix(X_SIZE, Y_SIZE);
	uint8_t *serialized_frame = malloc(NUM_SERIALIZED_BYTES * sizeof(uint8_t));
	read_frame("standard_frame", frame);
	serialize_frame(frame, serialized_frame);
	write_bytes(fd, serialized_frame, NUM_SERIALIZED_BYTES);

	close(fd);
	return (0);
}

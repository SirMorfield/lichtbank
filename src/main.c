/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   main.c                                             :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 15:03:18 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 21:48:45 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#include <stdbool.h>
#include <stdint.h>
#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#include "i2c.h"
#include "constans.h"
#include "frame_helpers.h"


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
	int32_t fd = open_i2c(0x04);
	bool **frame = alloc_matrix(X_SIZE, Y_SIZE);
	uint8_t *serialized_frame = malloc(NUM_SERIALIZED_BYTES * sizeof(uint8_t));

	read_frame("standard_frame", frame);
	write_frame(fd, frame, serialized_frame);

	close(fd);
	return (0);
}

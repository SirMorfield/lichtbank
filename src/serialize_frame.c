/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   serialize_frame.c                                  :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 01:58:33 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 21:49:03 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#include <stdbool.h>
#include <stdint.h>
#include "constans.h"
#include "serialize_frame.h"
#include <stdio.h>

void	serialize_frame(bool **frame, uint8_t *serialized_frame) {
	bool bitArray[NUM_SERIALIZED_BYTES * 8];
	int64_t bitArrayI = 0;

	for (int64_t column = 0; column < 8; column++) {
		for (int64_t panel = Y_SIZE / 8 - 1; panel >= 0; panel--) {
			if (panel % 2 == 1) {
				for (int64_t block = 0; block < 6; block++) {
					for (int64_t y = 0; y < 8; y++) {
						int64_t x = (7 - column) + (block * 8);
						bitArray[bitArrayI] = frame[y + (panel * 8)][x];
						bitArrayI++;
					}
				}
			} else {
				for (int64_t block = 0; block < 6; block++) {
					for (int64_t y = 7; y >= 0; y--) {
						int64_t x = X_SIZE - 1 - (7 - column) - (block * 8);
						bitArray[bitArrayI] = frame[y + (panel * 8)][x];
						bitArrayI++;
					}
				}
			}
			for (int64_t i = 0; i < 8; i++) {
				bitArray[bitArrayI] = i == column;
				bitArrayI++;
			}
		}
	}

	int64_t serialized_frame_i = 0;
	for (int64_t i = 0; i < NUM_PIXELS; i += 8) {
		uint8_t byte = 0;
		for (int64_t bit = 0; bit < 8; bit++) {
			byte |=  bitArray[bit + i] == true ? 1 : 0;
			byte <<= 1;
		}
		serialized_frame[serialized_frame_i] = byte;
		serialized_frame_i++;
	}
}

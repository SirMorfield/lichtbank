#ifndef FRAME_HELPERS_H
# define FRAME_HELPERS_H

#include <stdbool.h>
#include <stdint.h>

void	read_frame(char *filename, bool **frame);
void	write_frame(int32_t fd, bool **frame, uint8_t *serialized_frame);

#endif

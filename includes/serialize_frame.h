/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   serialize_frame.h                                  :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 14:34:20 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 17:26:16 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#ifndef SERIALIZE_FRAME_H
# define SERIALIZE_FRAME_H

#include <stdint.h>
#include <stdbool.h>

void	serialize_frame(bool **frame, uint8_t *serialized_frame);

#endif

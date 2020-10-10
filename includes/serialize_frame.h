/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   serialize_frame.h                                  :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 14:34:20 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 21:48:16 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#ifndef SERIALIZE_FRAME_H
# define SERIALIZE_FRAME_H

#include <stdbool.h>
#include <stdint.h>

void	serialize_frame(bool **frame, uint8_t *serialized_frame);

#endif

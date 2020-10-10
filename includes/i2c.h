/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   i2c.h                                              :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 21:11:57 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 21:48:13 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#ifndef I2C_H
# define I2C_H

#include <stdbool.h>
#include <stdint.h>

int32_t	open_i2c(int32_t addr);
void	write_bytes(int32_t fd, uint8_t *bytes, uint64_t len);
void	read_bytes(int32_t fd, uint8_t *buf, uint64_t n);

#endif

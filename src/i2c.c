/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   i2c.c                                              :+:    :+:            */
/*                                                     +:+                    */
/*   By: joppe <joppe@student.codam.nl>               +#+                     */
/*                                                   +#+                      */
/*   Created: 2020/10/10 21:11:59 by joppe         #+#    #+#                 */
/*   Updated: 2020/10/10 21:48:29 by joppe         ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

#include <stdbool.h>
#include <stdint.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/i2c-dev.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>

#include "i2c.h"

int32_t	open_i2c(int32_t addr)
{
	int32_t fd;

	fd = open("/dev/i2c-1", O_RDWR);
	if (fd < 0)
	{
		printf("Failed to open the i2c bus");
		return (-1);
	}
	if (ioctl(fd, I2C_SLAVE, addr) < 0)
	{
		printf("Failed to acquire bus access and/or talk to slave.\n");
		return (-1);
	}
	return (fd);
}

void	write_bytes(int32_t fd, uint8_t *bytes, uint64_t len)
{
	if (write(fd, bytes, len) != (int)len)
	{
		printf("Failed to write to the i2c bus.\n");
		printf("%s\n", strerror(errno));
	}
}

void	read_bytes(int32_t fd, uint8_t *buf, uint64_t n)
{
	if (read(fd, buf, n) != (int)n)
	{
		printf("Failed to read from the i2c bus.\n");
		printf("%s\n", strerror(errno));
	}
}

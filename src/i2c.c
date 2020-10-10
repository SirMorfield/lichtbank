#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/i2c-dev.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

#include "i2c.h"

int	open_i2c(int addr)
{
	int fd;
	char *filename = "/dev/i2c-1";
	fd = open(filename, O_RDWR);
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

void	write_bytes(int fd, uint8_t *bytes, uint64_t len)
{
	if (write(fd, bytes, len) != (int)len)
	{
		printf("Failed to write to the i2c bus.\n");
		printf("%s\n", strerror(errno));
	}
}

#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdint.h>
#include <stdbool.h>
#include <string.h>
#include <errno.h>
#include "gpio.h"

void	ft_strnrev(char *str, uint64_t len)
{
	char		left;
	uint64_t	left_i;
	uint64_t	right_i;

	if (len <= 1)
		return ;
	left_i = 0;
	right_i = len - 1;
	while (left_i < right_i)
	{
		left = str[left_i];
		str[left_i] = str[right_i];
		str[right_i] = left;
		left_i++;
		right_i--;
	}
}

char	*ui_to_str(uint64_t n, char *res)
{
	uint64_t	i;

	i = 0;
	while (true)
	{
		res[i] = (char)((n % 10) + '0');
		n /= 10;
		i++;
		if (n == 0)
			break ;
	}
	ft_strnrev(res, i);
	res[i] = '\0';
	return (res);
}

void	exit_error(char *msg, char *msg2)
{
	uint64_t	i;
	uint64_t	pin_len;
	char		pin_str[3];
	int32_t		fd_export;

	printf(msg, msg2);
	printf("%s\n", strerror(errno));
	i = 0;
	fd_export = open("/sys/class/gpio/unexport", O_WRONLY);
	if (fd_export != -1)
	{
		while (i < sizeof(g_fd_pins) / sizeof(g_fd_pins[0]))
		{
			if (g_fd_pins[i] != -1)
			{
				ui_to_str(i, pin_str);
				pin_len = i <= 9 ? 1 : 2;
				if (write(fd_export, pin_str, pin_len) != (ssize_t)pin_len)
					printf("Error writing to /sys/class/gpio/unexport\n");
				// close(g_fd_pins[i]);
			}
			i++;
		}
		close(fd_export);
	}
	if(g_fd_export != -1)
		close(g_fd_export);
	exit(1);
}

void	gpio_init(void)
{
	uint64_t i;

	i = 0;
	while (i < (sizeof(g_fd_pins) / sizeof(g_fd_pins[0])))
	{
		g_fd_pins[i] = -1;
		i++;
	}
	g_fd_export = open("/sys/class/gpio/export", O_WRONLY);
    if (g_fd_export == -1)
		exit_error("Unable to open /sys/class/gpio/export\n", "");
}

void	pinMode(uint64_t pin, MODE mode)
{
	uint64_t	pin_len;
	ssize_t		written;
	char		path[33];
	char		pin_str[3];

	ui_to_str(pin, pin_str);
	pin_len = pin <= 9 ? 1 : 2;
	if (write(g_fd_export, pin_str, pin_len) != (ssize_t)pin_len)
		exit_error("Error writing to /sys/class/gpio/export", "");
	sprintf(path, "/sys/class/gpio/gpio%s/direction", pin_str);
    g_fd_pins[pin] = open(path, O_WRONLY);
    if (g_fd_pins[pin] == -1)
		exit_error("Unable to open %s\n", path);
	if (mode == INPUT)
		written = write(g_fd_pins[pin], "in", 2);
	else
		written = write(g_fd_pins[pin], "out", 3);
	if (written != (mode == INPUT ? 2 : 3))
        exit_error("Error writing to %s", path);
}

void	digitalWrite(uint64_t pin, bool value)
{

	if (value)
	{
		if (write(g_fd_pins[pin], "1", 1) != 1)
			exit_error("Error writing value to pin\n", "");
	}
	else
	{
		if (write(g_fd_pins[pin], "0", 1) != 1)
			exit_error("Error writing value to pin\n", "");
	}
}

// int main()
// {


// }

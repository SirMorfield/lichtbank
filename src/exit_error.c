#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <stdlib.h>

void	exit_error(char *msg)
{
	printf(msg);
	printf("%s\n", strerror(errno));
	exit(1);
}

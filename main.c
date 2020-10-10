#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

int main(void)
{
	printf("%ul\n", sizeof(uint64_t));
	printf("%ul\n", sizeof(bool));
	return (0);
}

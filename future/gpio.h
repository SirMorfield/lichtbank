#ifndef GPIO_H
# define GPIO_H

typedef enum {
	INPUT = 0,
	OUTPUT = 1
}	MODE;

int32_t	g_fd_pins[26];
int32_t	g_fd_export;

void	gpio_init(void);
void	digitalWrite(uint64_t pin, bool value);
void	pinMode(uint64_t pin, MODE mode);


#endif

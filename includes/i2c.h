#ifndef I2C_H
# define I2C_H

# include <stdint.h>

int		open_i2c(int addr);
void	write_bytes(int fd, uint8_t *bytes, uint64_t len);


#endif

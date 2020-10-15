# **************************************************************************** #
#                                                                              #
#                                                         ::::::::             #
#    Makefile                                           :+:    :+:             #
#                                                      +:+                     #
#    By: joppe <joppe@student.codam.nl>               +#+                      #
#                                                    +#+                       #
#    Created: 2020/08/23 17:53:14 by joppe         #+#    #+#                  #
#    Updated: 2020/10/16 01:45:48 by joppe         ########   odam.nl          #
#                                                                              #
# **************************************************************************** #


NAME      	:= matrix

CC          := gcc
CFLAGS      := -Wall -Wextra -Werror

HEADERDIR	:= includes
SRCDIR      := src
BUILDDIR    := obj
SRCEXT      := c
OBJEXT      := o
LIBS		:= -lwiringPi

SOURCES     := $(shell find $(SRCDIR) -type f -name '*.$(SRCEXT)')
OBJECTS     := $(patsubst $(SRCDIR)/%,$(BUILDDIR)/%,$(SOURCES:.$(SRCEXT)=.$(OBJEXT)))

$(NAME): all

all: directories $(OBJECTS)
	$(CC) $(CFLAGS) ${LIBS} -I ${HEADERDIR}/ $(OBJECTS) -o $(NAME)

clean:
	/bin/rm -rf $(BUILDDIR)/*

fclean: clean
	/bin/rm -f $(NAME)

re: fclean all

directories:
	@mkdir -p $(BUILDDIR)
$(BUILDDIR)/%.$(OBJEXT): $(SRCDIR)/%.$(SRCEXT)
	$(CC) $(CFLAGS) -I ${HEADERDIR}/ -c $< -o $@

.PHONY: all clean fclean re directories

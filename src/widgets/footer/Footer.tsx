import { Container, Text } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        <Text className={classes.text}>© {new Date().getFullYear()} Т-Маркет</Text>
      </Container>
    </footer>
  );
}

export default Footer;

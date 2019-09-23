import App, { Container } from "next/app";
import React from "react";
//import { PageTransition } from "next-page-transitions";

export default class MyApp extends App {
  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Component originalProps={this.props} />
      </Container>
    );
    /* With Transition, not working on mobile
    return (
      <Container>
        <PageTransition timeout={20} classNames="">
          <Component originalProps={this.props} />
        </PageTransition>
        <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: opacity 500ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity 500ms;
          }
        `}</style>
      </Container>
    );*/
  }
}

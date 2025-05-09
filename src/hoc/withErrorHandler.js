import React from 'react';
import { Banner } from '@shopify/polaris';

const withErrorHandler = (WrappedComponent) => {
  return function ErrorHandlerWrapper(props) {
    const { error, ...rest } = props;
    return (
      <>
        {error && <Banner status="critical">{error}</Banner>}
        <WrappedComponent {...rest} />
      </>
    );
  };
};

export default withErrorHandler;

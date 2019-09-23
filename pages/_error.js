import React from "react";
import Head from "next/head";
import "../static/tailwind.css";

function Error(statusCode) {
  var code = statusCode.originalProps.pageProps.statusCode;
  return (
    <div className="p-6 pt-32 sm:p-20 lg:pl-56">
      <Head>
        <title>{code} - Error</title>
      </Head>
      <h1 className="font-semibold font-sans text-6xl text-gray-200 leading-tight">
        {code}
      </h1>
      <p className="font-sans text-gray-500 leading-tight">
        Unfortunatley an error occured
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res.statusCode;
  return { statusCode };
};

export default Error;

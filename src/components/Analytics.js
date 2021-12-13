import React, { useState, useEffect, useRef } from "react";
import Box from "./Box";
import axios, { CancelToken } from "axios";
export default function Analytics() {
  const componentIsMounted = useRef(true);
  const apiGateway =
    "https://t6x0zinjta.execute-api.us-east-1.amazonaws.com/api";
  const [manufacturerCount, setManufacturerCount] =
    useState("loading");
  const [reportCount, setReportCount] = useState("loading");
  const [anomalyCount, setanomalyCount] = useState("loading");

  useEffect(() => {
    const cancelTokenSource = CancelToken.source();
    async function fetchData() {
      try {
        const asyncResponse1 = await axios.get(
          apiGateway + "/numberofanomalies",
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        const asyncResponse2 = await axios.get(
          apiGateway + "/numberofreports",
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        const asyncResponse3 = await axios.get(
          apiGateway + "/numberofmanufacturers",
          {
            cancelToken: cancelTokenSource.token,
          }
        );

        if (componentIsMounted.current) {
          setManufacturerCount(asyncResponse3.data);
          setReportCount(asyncResponse2.data);
          setanomalyCount(asyncResponse1.data);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          return console.info(err);
        }

        console.error(err);
      }
    }

    fetchData();
    return () => {
      // here we cancel preveous http request that did not complete yet
      cancelTokenSource.cancel(
        "Cancelling previous http call because a new one was made ;-)"
      );
    };
  }, []);
  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function run this on component unmount
  return (
    <div className="dashboard">
      <Box
        result={manufacturerCount}
        title={"Number of Manufacturers"}
      />
      <Box result={anomalyCount} title={"Number of Anomlies"} />
      <Box result={reportCount} title={"Number of Reports"} />
    </div>
  );
}

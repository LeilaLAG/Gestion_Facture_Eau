import React from "react";

export default function Loading() {
  return (
    <div className="vh-100 w-100 d-flex justify-content-center align-items-center">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

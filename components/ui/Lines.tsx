import { Fragment } from "react";

// Merender judul multi-baris: ["One bot.", "Many things"] → One bot.<br/>Many things
export function Lines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

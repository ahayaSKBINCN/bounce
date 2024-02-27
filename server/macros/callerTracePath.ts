export const callerTrace = () => {
  const origin = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, stack) {
    return stack;
  };
  try {
    throw new Error();
  } catch (error) {
    // Error.captureStackTrace(err, arguments.callee);
    const stack = <CallSite[]><unknown>(<Error>error).stack!;
    console.log(stack.map(s =>  s.getFileName() + " " + s.getFunctionName()))
  }
  Error.prepareStackTrace = origin;
};

figma.showUI(__html__, {
  width: 800,
  height: 600,
});

figma.ui.onmessage = (msg) => {
  console.log(figma.currentPage, "当前页面");
  const { type } = msg;
  if (type === "init") {
    figma.ui.postMessage({
      type: "init",
      data: figma.currentPage,
    });
  }
};

// setTimeout(() => {
//   figma.ui.postMessage({
//     type: "FigmaLoad",
//     data: figma.currentPage,
//   });
// }, 1000);

//figma.closePlugin();

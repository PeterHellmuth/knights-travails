function knightMoves(start, end) {
  let possibleMoveTree = new moveTree(start);
  let buildQueue = [possibleMoveTree.root];
  while (!possibleMoveTree.endFound) {
    buildQueue = possibleMoveTree.buildMoveTree(buildQueue, end);
  }

  //if (possibleMoveTree.endFound) {
  // console.log(possibleMoveTree.printChain(possibleMoveTree.endFound));
  //}
  console.log(possibleMoveTree.root);
}

class moveTree {
  constructor(location) {
    this.root = new moveNode(location);
    this.board = new gameBoard(8, 8);
    this.endFound = false;
  }

  parentsContain(location, node = this.root) {
    if (node.parent) {
      if (
        node.parent.location[0] == location[0] &&
        node.parent.location[1] == location[1]
      ) {
        return true;
      } else {
        return this.parentsContain(location, node.parent);
      }
    } else {
      return false;
    }
  }

  printChain(node) {
    let returnStr = " : " + node.location.toString();
    let currentNode = node;
    while (currentNode.parent) {
      let parentStr = " : " + node.location.toString();
      returnStr = parentStr.concat(returnStr);
      currentNode = currentNode.parent;
    }

    return returnStr;
  }

  validMove(node, location) {
    if (node.parent) {
      if (this.parentsContain(location, node)) {
        //don't visit the same square twice in one chain, that means we're looping
        return false;
      }
    }
    return this.board.onBoard(location);
  }

  buildMoveTree(buildQueue, end) {
    let returnQueue = [];
    buildQueue.forEach((node) => {
      if (node) {
        if (!node.finalLocation) {
          let startX = node.location[0];
          let startY = node.location[1];
          let offsets = [
            [2, 1],
            [2, -1],
            [1, 2],
            [1, -2],
            [-1, 2],
            [-1, -2],
            [-2, 1],
            [-2, -1],
          ];
          offsets.forEach((offset) => {
            let newLoc = [startX + offset[0], startY + offset[1]];
            if (this.validMove(node, newLoc)) {
              let finalLocation = false;
              let newChild = new moveNode(newLoc, node);
              node.children.push(newChild);
              if (newLoc[0] == end[0] && newLoc[1] == end[1]) {
                finalLocation = true;
                this.endFound = newChild;
                return;
              }
            }
          });

          node.children.forEach((child) => {
            returnQueue.push(child);
          });
        }
      }
    });
    return returnQueue;
  }
}

class moveNode {
  constructor(location, parent = null) {
    this.children = [];
    this.parent = parent;
    this.location = location;
    this.finalLocation = false;
  }
}

class gameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  onBoard(location) {
    if (
      location[0] >= 0 &&
      location[0] < this.width &&
      location[1] >= 0 &&
      location[1] < this.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}

knightMoves([0, 0], [2, 1]);

import TreeNode from "./TreeNode";

const TreeView = ({ list = null, clickNode }) => {
  return (
    <div className="rounded py-1 flex-1">
      {list ? (
        <>
          {list.map((node, index) => (
            <TreeNode key={index} node={node} clickNode={clickNode} />
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TreeView;

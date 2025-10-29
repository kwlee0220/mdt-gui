const PanelTotal = () => {
  return (
    <div className="card card-body text-center">
      <h6>Total MDI Instance</h6>

      <div className="svg-center" id="pie_basic_legend">
        <svg width="120" height="120">
          <g transform="translate(60,60)">
            <g className="d3-arc d3-slice-border">
              <path
                d="M3.5514757175273244e-15,58A58,58 0 0,1 -56.51120830069507,-13.05692675921303L0,0Z"
                style={{ fill: "rgb(41, 182, 246)" }}
                transform="translate(0,0)"
              ></path>
            </g>
            <g className="d3-arc d3-slice-border">
              <path
                d="M-56.51120830069507,-13.05692675921303A58,58 0 0,1 57.407307263279556,8.270494107331828L0,0Z"
                style={{ fill: "rgb(102, 187, 106)" }}
                transform="translate(0,0)"
              ></path>
            </g>
            <g className="d3-arc d3-slice-border">
              <path
                d="M57.407307263279556,8.270494107331828A58,58 0 0,1 1.7757378587636622e-14,58L0,0Z"
                style={{ fill: "rgb(239, 83, 80)" }}
                transform="translate(0,0)"
              ></path>
            </g>
          </g>
        </svg>
        <h4 className="pt-1 mt-2 mb-0">2,020</h4>
        <ul className="chart-widget-legend">
          <li data-slice="0" style={{ borderBottom: "2px solid #29B6F6" }}>
            Running: <span>578</span>
          </li>
          <li data-slice="1" style={{ borderBottom: "2px solid #66BB6A" }}>
            Stopped: <span>983</span>
          </li>
          <li data-slice="2" style={{ borderBottom: "2px solid #EF5350" }}>
            Failed: <span>459</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PanelTotal;

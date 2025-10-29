import useCommon from "apps/hooks/useCommon";

const useDataManager = () => {
  const { instanceList } = useCommon();

  const GET_TEST_NODELIST = () => {
    var list = [];

    for (var i = 1; i < 11; i++) {
      var item = {
        type: "data",
        title: "",
        item: null,
      };

      if (i < 4) {
        item.type = "data";
        item.title = "Data-" + i;
      } else if (i < 6) {
        item.type = "simulation";
        item.title = "Simulation-" + i;
      } else if (i < 8) {
        item.type = "ai";
        item.title = "AI-" + i;
      } else {
        item.type = "legacy";
        item.title = "Legacy-" + i;
      }

      list.push(item);
    }

    return list;
  };

  const GET_DATA_SOURCE_TREE = [
    {
      id: 1,
      label: "Data",
      children: [
        {
          id: 2,
          label: "SubModelInfo(SMC)",
        },
        {
          id: 3,
          label: "DataInfo(SMC)",
          children: [
            {
              id: 4,
              label: "Equipment(SMC)",
              children: [
                {
                  id: 5,
                  label: "EquipmentID(Property)",
                },
                {
                  id: 6,
                  label: "EquipmentName(Property)",
                },
                {
                  id: 7,
                  label: "Parameters(SML)",
                  children: [
                    {
                      id: 8,
                      label: "TaktTime(SMC)",
                    },
                    {
                      id: 9,
                      label: "FaultRate(SMC)",
                    },
                    {
                      id: 10,
                      label: "AssetState(SML)",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const GET_DATA_TARGET_TREE = [
    {
      id: 1,
      label: "Simulation(Submodel)",
      children: [
        {
          id: 2,
          label: "SubModelInfo(SMC)",
        },
        {
          id: 3,
          label: "SimulationInfo(SMC)",
          children: [
            {
              id: 4,
              label: "Model(SMC)",
            },
            {
              id: 5,
              label: "Inputs(SMC)",
              children: [
                {
                  id: 6,
                  label: "TaktTime(SMC)",
                },
                {
                  id: 7,
                  label: "FaultRate(SMC)",
                },
              ],
            },
            {
              id: 8,
              label: "Outputs(SML)",
              children: [
                {
                  id: 9,
                  label: "TotalThroughput(SMC)",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const GET_INSTANCE_LIST_FOR_TIMER = () => {
    let list = [...instanceList];

    return list;
  };

  return {
    GET_TEST_NODELIST,
    GET_DATA_SOURCE_TREE,
    GET_DATA_TARGET_TREE,
    GET_INSTANCE_LIST_FOR_TIMER,
  };
};

export default useDataManager;

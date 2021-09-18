export const Config = {
  borderWeight: 4,
  // // Deploy
  MapBounds: [200, 112],
  debug: false,
  gridSpacing: 10,
  AntSize: 10,
  TrailDiameter: 3,
  ViewDistance: 2,
  TrailDropRate: 5,
  AntsToSpawn: 1000,
  // // Debug
  // ViewDistance: 30,
  // MapBounds: [30, 16],
  // debug: true,
  // gridSpacing: 25,
  // AntSize: 35,
  // TrailDiameter: 10,
  // TrailDropRate: 15,
  // AntsToSpawn: 4,
  // //////
  TrailDecayInterval: 20,
  AlphaPerDecay: 50,
  gridWeight: 1,
  ViewAngle: 45,
  AntStepDistance: 0.3,
  AntWanderChance: 0.2,
  AntWanderAmount: 30,
  MaxSmellTurnRate: 55,
  MinSmellTurnRate: 20,
  FoodPerCell: 20,
  BackgroundColor: "#909497",
  StayOnCourseWanderAmount: 25,
  FrameRate: 30,
  PercentFoodReturnedToStopTime: 0.99,
  TrailDecayRange: 250,
  TrailTransparencyFloor: 0.005,
  PreloadMap: true,
  BlockDecaySteps: 10,
  MinDecayableAlpha: 50,
  brushTypeDefaultIndex: 1,
  DirtPerCell: 50,
  brushes: [
    {
      value: "w",
      name: "Wall",
      shortName: "W",
      color: "black",
    },
    {
      value: "h",
      name: "Home",
      shortName: "H",
      color: "#C0392B",
    },
    {
      value: "f",
      name: "Food",
      shortName: "F",
      color: "#186A3B",
      decayable: true,
    },
    {
      value: "d",
      name: "Dirt",
      shortName: "D",
      color: "#40260F",
      decayable: true,
    },
    {
      value: " ",
      shortName: "E",
      name: "Eraser",
    },
  ],
  brushSizeDefaultIndex: 1,
  brushSizes: [
    {
      value: "1",
      shortName: "S",
      name: "Small",
    },
    {
      value: "3",
      shortName: "M",
      name: "Medium",
    },
    {
      value: "5",
      shortName: "L",
      name: "Large",
    },
    {
      value: "7",
      shortName: "XL",
      name: "XL",
    },
  ],
  DefaultPreload: "index",
  SampleMaps: {
    samplea: "/assets/maps/SampleAV1.1.json",
    sampleb: "/assets/maps/SampleBV1.1.json",
    samplec: "/assets/maps/SampleCV1.1.json",
    samplee: "/assets/maps/SampleEV1.0.json",
    index: "/assets/maps/HomeMapV1.0.json",
  },
  Challenge: {
    overrideServerConfig: false,
    overrideChallengeID: false,
    overrideConfigID: "",
    config: {
      mapPath: "/assets/maps/ChallengeFV1.0.json",
      homeLimit: 5,
      time: {
        min: 1,
        sec: 30,
      },
      name: "Locally Configured Challenge",
    },
  },
};

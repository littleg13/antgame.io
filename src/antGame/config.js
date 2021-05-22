export const Config = {
  // HomeColor: "#196F3D",
  vUnderscan: 100,
  hUnderscan: 10,
  borderWeight: 4,
  brushMin: 1,
  brushMax: 7,
  // // Deploy
  MapBounds: [200, 112],
  debug: false,
  brushSizeDefault: 3,
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
  // brushSizeDefault: 1,
  // gridSpacing: 25,
  // AntSize: 35,
  // TrailDiameter: 10,
  // TrailDropRate: 15,
  // AntsToSpawn: 4,
  // //////
  TrailDecayInterval: 20,
  AlphaPerDecay: 50, // 50??
  gridWeight: 1,
  ViewAngle: 45,
  brushTypeDefaultIndex: 1,
  AntStepDistance: 0.3,
  AntWanderChance: 0.2,
  AntWanderAmount: 30,
  MaxSmellTurnRate: 55,
  MinSmellTurnRate: 20,
  FoodPerCell: 20,
  BackgroundColor: "#909497",
  StayOnCourseWanderAmount: 15,
  // MinSmellFloor: 1250,
  FrameRate: 50,
  PercentFoodReturnedToStopTime: 0.99,
  TrailDecayRange: 300,
  TrailTransparencyFloor: 0.01,
  PreloadMap: false,
  PreloadMapPath: "antgameMap.json",
  brushes: [
    {
      value: "w",
      name: "Wall",
      color: "black",
    },
    {
      value: "h",
      name: "Home",
      color: "#C0392B", // #2980B9
    },
    // {
    //   value: "h2",
    //   name: "RHome",
    //   color: "#C0392B",
    // },
    {
      value: "f",
      name: "Food",
      color: "#186A3B",
    },
    {
      value: " ",
      name: "Eraser",
    },
  ],
};

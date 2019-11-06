import flagIcon from "../../images/bloqs/flag.svg";
import flagLoopIcon from "../../images/bloqs/flag-loop.svg";
import flagTimesIcon from "../../images/bloqs/flag-times.svg";
import switch1OnIcon from "../../images/bloqs/switch-1on.svg";
import switch1OffIcon from "../../images/bloqs/switch-1off.svg";
import switch2OnIcon from "../../images/bloqs/switch-2on.svg";
import switch2OffIcon from "../../images/bloqs/switch-2off.svg";
import viewColorBlack from "../../images/bloqs/view-color-black.svg";
import viewColorWhite from "../../images/bloqs/view-color-white.svg";
import viewColorBlue from "../../images/bloqs/view-color-blue.svg";
import viewColorGreen from "../../images/bloqs/view-color-green.svg";
import viewColorRed from "../../images/bloqs/view-color-red.svg";
import notViewColorBlack from "../../images/bloqs/not-view-color-black.svg";
import notViewColorWhite from "../../images/bloqs/not-view-color-white.svg";
import notViewColorBlue from "../../images/bloqs/not-view-color-blue.svg";
import notViewColorGreen from "../../images/bloqs/not-view-color-green.svg";
import notViewColorRed from "../../images/bloqs/not-view-color-red.svg";
import buttonPressedIcon from "../../images/bloqs/button-pressed.svg";
import buttonReleasedIcon from "../../images/bloqs/button-released.svg";
import sevenSegmentsIcon from "../../images/bloqs/7segments.svg";
import obstacleIcon from "../../images/bloqs/obstacle.svg";
import noObstacleIcon from "../../images/bloqs/no-obstacle.svg";
import musicIcon from "../../images/bloqs/music.svg";
import music1Icon from "../../images/bloqs/music1.svg";
import music2Icon from "../../images/bloqs/music2.svg";
import music3Icon from "../../images/bloqs/music3.svg";
import music4Icon from "../../images/bloqs/music4.svg";
import musicStopIcon from "../../images/bloqs/music-stop.svg";
import sendAIcon from "../../images/bloqs/send-message-a.svg";
import sendBIcon from "../../images/bloqs/send-message-b.svg";
import sendCIcon from "../../images/bloqs/send-message-c.svg";
import sendDIcon from "../../images/bloqs/send-message-d.svg";
import sendEIcon from "../../images/bloqs/send-message-e.svg";
import onAIcon from "../../images/bloqs/on-message-a.svg";
import onBIcon from "../../images/bloqs/on-message-b.svg";
import onCIcon from "../../images/bloqs/on-message-c.svg";
import onDIcon from "../../images/bloqs/on-message-d.svg";
import onEIcon from "../../images/bloqs/on-message-e.svg";
import lightIcon from "../../images/bloqs/light.svg";
import darkIcon from "../../images/bloqs/dark.svg";
import temperatureHotIcon from "../../images/bloqs/temperature-hot.svg";
import temperatureColdIcon from "../../images/bloqs/temperature-cold.svg";
import led1OnIcon from "../../images/bloqs/led1-on.svg";
import led1OffIcon from "../../images/bloqs/led1-off.svg";
import led2OnIcon from "../../images/bloqs/led2-on.svg";
import led2OffIcon from "../../images/bloqs/led2-off.svg";
import boardLedOnIcon from "../../images/bloqs/board-led-on.svg";
import boardLedOffIcon from "../../images/bloqs/board-led-off.svg";
import servoIcon from "../../images/bloqs/servo.svg";
import servoClockwiseSlowIcon from "../../images/bloqs/servo-clockwise-slow.svg";
import servoClockwiseMediumIcon from "../../images/bloqs/servo-clockwise-medium.svg";
import servoClockwiseFastIcon from "../../images/bloqs/servo-clockwise-fast.svg";
import servoCounterClockwiseSlowIcon from "../../images/bloqs/servo-counterclockwise-slow.svg";
import servoCounterClockwiseMediumIcon from "../../images/bloqs/servo-counterclockwise-medium.svg";
import servoCounterClockwiseFastIcon from "../../images/bloqs/servo-counterclockwise-fast.svg";
import servoStopIcon from "../../images/bloqs/servo-stop.svg";

import { IBloqType, BloqCategory, BloqParameterType } from "@bitbloq/bloqs";

export const bloqTypes: Array<Partial<IBloqType>> = [
  {
    category: BloqCategory.Event,
    name: "OnStart",
    label: "bloq-on-start",
    icon: flagIcon,
    iconSwitch: {
      "type === 'loop'": flagLoopIcon,
      "type === 'times'": flagTimesIcon,
      true: flagIcon
    },
    configurationComponent: "StartConfiguration",
    parameters: [
      {
        name: "type",
        label: "bloq-parameter-start-type",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-start-loop",
            value: "loop"
          },
          {
            label: "bloq-parameter-start-times",
            value: "times"
          }
        ]
      },
      {
        name: "times",
        label: "bloq-parameter-start-times",
        type: BloqParameterType.Number,
        defaultValue: 1
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnSwitch1OnOff",
    label: "bloq-on-switch",
    components: ["ZumjuniorDoubleSwitch"],
    iconSwitch: {
      "value === 'pos2'": switch1OffIcon,
      "value === 'pos1'": switch1OnIcon
    },
    actions: [
      {
        name: "read",
        parameters: {
          pinVarName: "{{component}}Pin0"
        }
      }
    ],
    configurationComponent: "SwitchConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-off",
            value: "pos2"
          },
          {
            label: "bloq-parameter-on",
            value: "pos1"
          }
        ]
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnSwitch2OnOff",
    label: "bloq-on-switch",
    components: ["ZumjuniorDoubleSwitch"],
    iconSwitch: {
      "value === 'pos2'": switch2OffIcon,
      "value === 'pos1'": switch2OnIcon
    },
    actions: [
      {
        name: "read",
        parameters: {
          pinVarName: "{{component}}Pin1"
        }
      }
    ],
    configurationComponent: "SwitchConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-off",
            value: "pos2"
          },
          {
            label: "bloq-parameter-on",
            value: "pos1"
          }
        ]
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnMessage",
    label: "bloq-on-message",
    iconSwitch: {
      "value === 'messageA'": onAIcon,
      "value === 'messageB'": onBIcon,
      "value === 'messageC'": onCIcon,
      "value === 'messageD'": onDIcon,
      "value === 'messageE'": onEIcon
    },
    code: {
      globals: [
        "bool ___messageA = false;",
        "bool ___messageB = false;",
        "bool ___messageC = false;",
        "bool ___messageD = false;",
        "bool ___messageE = false;"
      ],
      endloop: [
        "___messageA = false;",
        "___messageB = false;",
        "___messageC = false;",
        "___messageD = false;",
        "___messageE = false;"
      ]
    },
    actions: [
      {
        name: "onMessage",
        parameters: {
          variable: "___{{value}}"
        }
      }
    ],
    configurationComponent: "ReceiveMessageConfiguration",
    parameters: [
      {
        name: "value",
        label: "bloq-message-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "A",
            value: "messageA"
          },
          {
            label: "B",
            value: "messageB"
          },
          {
            label: "C",
            value: "messageC"
          },
          {
            label: "D",
            value: "messageD"
          },
          {
            label: "E",
            value: "messageE"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnButtonPress",
    label: "bloq-on-button-pressed",
    components: ["Button"],
    iconSwitch: {
      "value === 'pressed'": buttonPressedIcon,
      "value === 'released'": buttonReleasedIcon
    },
    actions: [
      {
        name: "read",
        parameters: {
          pinVarName: "{{component}}Pin"
        }
      }
    ],
    configurationComponent: "ButtonConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-button",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-action",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-press",
            value: "pressed"
          },
          {
            label: "bloq-parameter-release",
            value: "released"
          }
        ]
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Event,
    name: "OnSevenSegmentValue",
    label: "bloq-on-seven-segment",
    icon: sevenSegmentsIcon,
    components: ["ZumjuniorSevenSegment"],
    actions: [
      {
        name: "readNumber",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "GetNumberConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-seven-segment",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-trueCondition",
        type: BloqParameterType.Hidden,
        value: "=="
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnObstacle",
    label: "bloq-on-obstacle",
    iconSwitch: {
      "value === 'obstacle'": obstacleIcon,
      "value === 'no_obstacle'": noObstacleIcon
    },
    actions: [
      {
        name: "readDistance",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    components: ["ZumjuniorMultiSensor"],
    configurationComponent: "ObstacleConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-detect",
            value: "obstacle"
          },
          {
            label: "bloq-parameter-not-detect",
            value: "no_obstacle"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnDetectColor",
    label: "bloq-on-detect-color",
    iconSwitch: {
      "detect === 'true' and color === 'black'": viewColorBlack,
      "detect === 'true' and color === 'white'": viewColorWhite,
      "detect === 'true' and color === 'blue'": viewColorBlue,
      "detect === 'true' and color === 'green'": viewColorGreen,
      "detect === 'true' and color === 'red'": viewColorRed,
      "detect === 'false' and color === 'black'": notViewColorBlack,
      "detect === 'false' and color === 'white'": notViewColorWhite,
      "detect === 'false' and color === 'blue'": notViewColorBlue,
      "detect === 'false' and color === 'green'": notViewColorGreen,
      "detect === 'false' and color === 'red'": notViewColorRed
    },
    configurationComponent: "ViewColorConfiguration",
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readColor",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "detect",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-detect",
            value: "true"
          },
          {
            label: "bloq-parameter-not-detect",
            value: "false"
          }
        ]
      },
      {
        name: "color",
        label: "bloq-parameter-color",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-black",
            value: "black"
          },
          {
            label: "bloq-parameter-white",
            value: "white"
          },
          {
            label: "bloq-parameter-red",
            value: "red"
          },
          {
            label: "bloq-parameter-green",
            value: "green"
          },
          {
            label: "bloq-parameter-blue",
            value: "blue"
          }
        ]
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Hidden,
        value: "{{detect}}{{color}}"
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnDetectLight",
    label: "bloq-on-detect-light",
    iconSwitch: {
      "value === 'light'": lightIcon,
      "value === 'dark'": darkIcon
    },
    actions: [
      {
        name: "readLight",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "DetectLightConfiguration",
    components: ["ZumjuniorMultiSensor"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-light",
            value: "light"
          },
          {
            label: "bloq-parameter-dark",
            value: "dark"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Event,
    name: "OnDetectTemperature",
    label: "bloq-on-detect-temperature",
    iconSwitch: {
      "value === 'hot'": temperatureHotIcon,
      "value === 'cold'": temperatureColdIcon
    },
    actions: [
      {
        name: "readTemperature",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "TemperatureConfiguration",
    components: ["ZumjuniorMultiSensor"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-hot",
            value: "hot"
          },
          {
            label: "bloq-parameter-cold",
            value: "cold"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "SetLed1OnOff",
    label: "bloq-led1",
    components: ["ZumjuniorDoubleLed"],
    iconSwitch: {
      "value === 'on'": led1OnIcon,
      "value === 'off'": led1OffIcon
    },
    configurationComponent: "TurnOnConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },

      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: "on"
          },
          {
            label: "bloq-parameter-off",
            value: "off"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}WhitePin",
          value: "{{value}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "SetLed2OnOff",
    label: "bloq-led2",
    components: ["ZumjuniorDoubleLed"],
    iconSwitch: {
      "value === 'on'": led2OnIcon,
      "value === 'off'": led2OffIcon
    },
    configurationComponent: "TurnOnConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },

      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-on",
            value: "on"
          },
          {
            label: "bloq-parameter-off",
            value: "off"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}ColorPin",
          value: "{{value}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "ContRotServo",
    label: "bloq-cr-servo",
    components: ["ContRotServo"],
    iconSwitch: {
      "rotation === 'clockwise' and speed === 'slow'": servoClockwiseSlowIcon,
      "rotation === 'clockwise' and speed === 'medium'": servoClockwiseMediumIcon,
      "rotation === 'clockwise' and speed === 'fast'": servoClockwiseFastIcon,
      "rotation === 'counterclockwise' and speed === 'slow'": servoCounterClockwiseSlowIcon,
      "rotation === 'counterclockwise' and speed === 'medium'": servoCounterClockwiseMediumIcon,
      "rotation === 'counterclockwise' and speed === 'fast'": servoCounterClockwiseFastIcon,
      "rotation === 'stop'": servoStopIcon,
      true: servoIcon
    },
    configurationComponent: "ServoConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "rotation",
        label: "bloq-parameter-rotation",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-clockwise",
            value: "clockwise"
          },
          {
            label: "bloq-parameter-counterclockwise",
            value: "counterclockwise"
          },
          {
            label: "bloq-parameter-stop",
            value: "stop"
          }
        ]
      },
      {
        name: "speed",
        label: "bloq-parameter-speed",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-slow",
            value: "slow"
          },
          {
            label: "bloq-parameter-medium",
            value: "medium"
          },
          {
            label: "bloq-parameter-fast",
            value: "fast"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}",
          value: "{{rotation}}{{speed}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "ServoPosition",
    label: "bloq-servo-position",
    components: ["ZumjuniorMiniservo"],
    iconComponent: "ServoPositionIcon",
    configurationComponent: "ServoPositionConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number,
        defaultValue: 90
      }
    ],
    code: {},
    actions: [
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}",
          value: "{{value}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "RGBLed",
    label: "bloq-rgbled-color",
    components: ["DigitalRGBLED"],
    iconSwitch: {
      "value === 'off'": boardLedOffIcon,
      true: boardLedOnIcon
    },
    configurationComponent: "TurnOnColorConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-color",
        type: BloqParameterType.Select,
        options: [
          {
            label: "white",
            value: "white"
          },
          {
            label: "red",
            value: "red"
          },
          {
            label: "green",
            value: "green"
          },
          {
            label: "blue",
            value: "blue"
          },
          {
            label: "off",
            value: "off"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}",
          value: "{{value}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "Music",
    label: "bloq-music",
    components: ["Buzzer"],
    iconSwitch: {
      "melody === '1'": music1Icon,
      "melody === '2'": music2Icon,
      "melody === '3'": music3Icon,
      "melody === '4'": music4Icon,
      "melody === 'stop'": musicStopIcon,
      true: musicIcon
    },
    configurationComponent: "MusicConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "melody",
        label: "bloq-parameter-melody",
        type: BloqParameterType.Select,
        options: [
          {
            label: "melody-1",
            value: "1"
          },
          {
            label: "melody-2",
            value: "2"
          },
          {
            label: "melody-3",
            value: "3"
          },
          {
            label: "melody-4",
            value: "4"
          },
          {
            label: "melody-stop",
            value: "stop"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: "write",
        parameters: {
          pinVarName: "{{component}}",
          value: "{{value}}",
          duration: "{{duration}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "SetSevenSegmentNumericValue",
    label: "bloq-set-seven-segment-num",
    components: ["ZumjuniorSevenSegment"],
    icon: sevenSegmentsIcon,
    configurationComponent: "SetNumberConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number
      },
      {
        name: "action",
        label: "bloq-message-action",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-set",
            value: "writeNumber"
          },
          {
            label: "bloq-parameter-increment",
            value: "incrementNumber"
          },
          {
            label: "bloq-parameter-decrement",
            value: "decrementNumber"
          }
        ]
      }
    ],
    code: {},
    actions: [
      {
        name: "writeNumber",
        parameters: {
          pinVarName: "{{component}}i2c",
          value: "{{value}}"
        }
      },
      {
        name: "incrementNumber",
        parameters: {
          pinVarName: "{{component}}i2c",
          value: "{{value}}"
        }
      },
      {
        name: "decrementNumber",
        parameters: {
          pinVarName: "{{component}}i2c",
          value: "{{value}}"
        }
      }
    ]
  },
  {
    category: BloqCategory.Action,
    name: "sendMessageA",
    label: "bloq-send-message",
    iconSwitch: {
      "value === 'messageA'": sendAIcon,
      "value === 'messageB'": sendBIcon,
      "value === 'messageC'": sendCIcon,
      "value === 'messageD'": sendDIcon,
      "value === 'messageE'": sendEIcon
    },
    code: {
      globals: [
        "bool ___messageA = false;",
        "bool ___messageB = false;",
        "bool ___messageC = false;",
        "bool ___messageD = false;",
        "bool ___messageE = false;"
      ]
    },
    actions: [
      {
        name: "send",
        parameters: {
          code: "___{{value}} = true;"
        }
      }
    ],
    configurationComponent: "SendMessageConfiguration",
    parameters: [
      {
        name: "value",
        label: "bloq-message-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "A",
            value: "messageA"
          },
          {
            label: "B",
            value: "messageB"
          },
          {
            label: "C",
            value: "messageC"
          },
          {
            label: "D",
            value: "messageD"
          },
          {
            label: "E",
            value: "messageE"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitSeconds",
    label: "bloq-wait-seconds",
    iconComponent: "WaitIcon",
    configurationComponent: "WaitConfiguration",
    parameters: [
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number,
        defaultValue: 1
      }
    ],
    code: {},
    actions: [
      {
        name: "wait",
        parameters: {
          code: "heap.insert({{functionName}},{{value}}*1000);"
        }
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitObstacle",
    label: "bloq-wait-obstacle",
    iconSwitch: {
      "value === 'obstacle'": obstacleIcon,
      "value === 'no_obstacle'": noObstacleIcon
    },
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readDistance",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "ObstacleConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-sensors",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-detect",
            value: "obstacle"
          },
          {
            label: "bloq-parameter-not-detect",
            value: "no_obstacle"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitDetectColor",
    label: "bloq-wait-detect-color",
    iconSwitch: {
      "detect === 'true' and color === 'black'": viewColorBlack,
      "detect === 'true' and color === 'white'": viewColorWhite,
      "detect === 'true' and color === 'blue'": viewColorBlue,
      "detect === 'true' and color === 'green'": viewColorGreen,
      "detect === 'true' and color === 'red'": viewColorRed,
      "detect === 'false' and color === 'black'": notViewColorBlack,
      "detect === 'false' and color === 'white'": notViewColorWhite,
      "detect === 'false' and color === 'blue'": notViewColorBlue,
      "detect === 'false' and color === 'green'": notViewColorGreen,
      "detect === 'false' and color === 'red'": notViewColorRed
    },
    configurationComponent: "ViewColorConfiguration",
    components: ["ZumjuniorMultiSensor"],
    actions: [
      {
        name: "readColor",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "detect",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-detect",
            value: "true"
          },
          {
            label: "bloq-parameter-not-detect",
            value: "false"
          }
        ]
      },
      {
        name: "color",
        label: "bloq-parameter-color",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-black",
            value: "black"
          },
          {
            label: "bloq-parameter-white",
            value: "white"
          },
          {
            label: "bloq-parameter-red",
            value: "red"
          },
          {
            label: "bloq-parameter-green",
            value: "green"
          },
          {
            label: "bloq-parameter-blue",
            value: "blue"
          }
        ]
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Hidden,
        value: "{{detect}}{{color}}"
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitDetectLight",
    label: "bloq-wait-detect-light",
    iconSwitch: {
      "value === 'light'": lightIcon,
      "value === 'dark'": darkIcon
    },
    actions: [
      {
        name: "readLight",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "DetectLightConfiguration",
    components: ["ZumjuniorMultiSensor"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-light",
            value: "light"
          },
          {
            label: "bloq-parameter-dark",
            value: "dark"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitDetectTemperature",
    label: "bloq-wait-detect-temperature",
    iconSwitch: {
      "value === 'hot'": temperatureHotIcon,
      "value === 'cold'": temperatureColdIcon
    },
    actions: [
      {
        name: "readTemperature",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "TemperatureConfiguration",
    components: ["ZumjuniorMultiSensor"],
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-detect",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-hot",
            value: "hot"
          },
          {
            label: "bloq-parameter-cold",
            value: "cold"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitButtonPressed",
    label: "bloq-wait-button-pressed",
    components: ["Button"],
    iconSwitch: {
      "value === 'pressed'": buttonPressedIcon,
      "value === 'released'": buttonReleasedIcon
    },
    actions: [
      {
        name: "read",
        parameters: {
          pinVarName: "{{component}}Pin"
        }
      }
    ],
    configurationComponent: "ButtonConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-button",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-action",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-press",
            value: "pressed"
          },
          {
            label: "bloq-parameter-release",
            value: "released"
          }
        ]
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WaitForSevenSegmentValue",
    label: "bloq-wait-seven-segment",
    icon: sevenSegmentsIcon,
    components: ["ZumjuniorSevenSegment"],
    actions: [
      {
        name: "readNumber",
        parameters: {
          pinVarName: "{{component}}i2c"
        }
      }
    ],
    configurationComponent: "GetNumberConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-seven-segment",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Number
      },
      {
        name: "trueCondition",
        label: "bloq-parameter-true",
        value: "==",
        type: BloqParameterType.Hidden
      }
    ]
  },
  {
    category: BloqCategory.Wait,
    name: "WainSwitch1OnOff",
    label: "bloq-wait-switch",
    components: ["ZumjuniorDoubleSwitch"],
    iconSwitch: {
      "value === 'pos2'": switch1OffIcon,
      "value === 'pos1'": switch1OnIcon
    },
    actions: [
      {
        name: "read",
        parameters: {
          pinVarName: "{{component}}Pin0",
          value: "{{value}}"
        }
      }
    ],
    configurationComponent: "SwitchConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-off",
            value: "pos2"
          },
          {
            label: "bloq-parameter-on",
            value: "pos1"
          }
        ]
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Wait,
    name: "WainSwitch2OnOff",
    label: "bloq-wait-switch",
    components: ["ZumjuniorDoubleSwitch"],
    iconSwitch: {
      "value === 'pos2'": switch2OffIcon,
      "value === 'pos1'": switch2OnIcon
    },
    actions: [
      {
        name: "read",
        parameters: {
          pinVarName: "{{component}}Pin1",
          value: "{{value}}"
        }
      }
    ],
    configurationComponent: "SwitchConfiguration",
    parameters: [
      {
        name: "component",
        label: "bloq-parameter-component",
        type: BloqParameterType.SelectComponent
      },
      {
        name: "value",
        label: "bloq-parameter-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "bloq-parameter-off",
            value: "pos2"
          },
          {
            label: "bloq-parameter-on",
            value: "pos1"
          }
        ]
      }
    ],
    code: {}
  },
  {
    category: BloqCategory.Wait,
    name: "WaitMessage",
    label: "bloq-wait-message",
    iconSwitch: {
      "value === 'messageA'": onAIcon,
      "value === 'messageB'": onBIcon,
      "value === 'messageC'": onCIcon,
      "value === 'messageD'": onDIcon,
      "value === 'messageE'": onEIcon
    },
    code: {
      globals: [
        "bool ___messageA = false;",
        "bool ___messageB = false;",
        "bool ___messageC = false;",
        "bool ___messageD = false;",
        "bool ___messageE = false;"
      ],
      endloop: [
        "___messageA = false;",
        "___messageB = false;",
        "___messageC = false;",
        "___messageD = false;",
        "___messageE = false;"
      ]
    },
    actions: [
      {
        name: "onMessage",
        parameters: {
          variable: "___{{value}}"
        }
      }
    ],
    configurationComponent: "ReceiveMessageConfiguration",
    parameters: [
      {
        name: "value",
        label: "bloq-message-value",
        type: BloqParameterType.Select,
        options: [
          {
            label: "A",
            value: "messageA"
          },
          {
            label: "B",
            value: "messageB"
          },
          {
            label: "C",
            value: "messageC"
          },
          {
            label: "D",
            value: "messageD"
          },
          {
            label: "E",
            value: "messageE"
          }
        ]
      }
    ]
  }
];

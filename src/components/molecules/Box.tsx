import React from "react";
import { View } from "react-native";
import { Defs, G, LinearGradient, Path, Stop, Svg } from "react-native-svg";

const Box = ({
  size = 60,
  brick = null,
  center = { color1: null, color2: null },
  double = { color1: null, color2: null },
  colors = { color1: "#E75033", color2: "#C12E27" },
  cover = "#C6C6C5",
}: {
  size?: number;
  brick?: string | null;
  center?: {
    color1: string | null;
    color2: string | null;
  };
  double?: {
    color1: string | null;
    color2: string | null;
  };
  colors?: {
    color1: string | null;
    color2: string | null;
  };
  cover?: string;
}) => (
  <Svg width={size} height={(size * 52) / 60} viewBox="0 0 60 52" fill="none">
    <Path
      d="M60 21.7823H50.7074L34.8087 10.2997C31.8304 8.14956 27.8943 8.15534 24.9271 10.317L9.16047 21.788H0.00549316V30.7343H0.0165141C0.0770701 31.8872 0.616571 33.0228 1.63501 33.7606L24.2114 50.0738C27.7732 52.6504 32.491 52.6389 36.0473 50.0507L58.365 33.801C59.3944 33.0516 59.9229 31.9045 59.9725 30.7343H60V21.788V21.7823Z"
      fill="url(#colors)"
    />
    {double?.color1 && double?.color2 && (
      <Path
        d="M60 21.726H59.3669C59.1082 21.3168 58.7724 20.9421 58.354 20.6423L34.8087 3.6317C31.8304 1.48159 27.8943 1.48737 24.9271 3.64901L1.62399 20.5962C1.18909 20.9132 0.847788 21.2995 0.589049 21.726H0V24.0664H0.0110041C0.0715602 25.2192 0.611061 26.3548 1.6295 27.0927L24.2059 43.4058C27.7677 45.9825 32.4856 45.9709 36.0418 43.3827L58.3595 27.133C59.3889 26.3836 59.9174 25.2365 59.967 24.0664H59.9945V21.726H60Z"
        fill="url(#douleColor)"
      />
    )}
    <Path
      d="M1.63497 25.0692L24.2113 41.3824C27.7731 43.959 32.491 43.9475 36.0473 41.3593L58.3649 25.1096C60.5284 23.5359 60.5229 20.181 58.3539 18.6189L34.8086 1.60826C31.8304 -0.541847 27.8943 -0.536066 24.927 1.62557L1.62395 18.5728C-0.539555 20.1465 -0.534039 23.5013 1.63497 25.0634V25.0692Z"
      fill={cover ?? "#C6C6C5"}
    />
    {brick && (
      <G>
        <Path
          d="M4.93262 29.4782V27.4491L37.5833 3.625L38.277 4.10345L5.66479 27.9679V29.9854L4.93262 29.4782Z"
          fill={brick ?? "#9A9A9A"}
        />
        <Path
          d="M19.3944 39.9211V37.892L52.0121 14.0391L52.6947 14.5233L20.0605 38.3531L20.0771 40.4168L19.3944 39.9211Z"
          fill={brick ?? "#9A9A9A"}
        />
        <Path
          d="M53.1243 30.9554V28.7361L20.3965 4.92355L21.0681 4.43359L53.895 28.3153V30.4193L53.1243 30.9554Z"
          fill={brick ?? "#9A9A9A"}
        />
        <Path
          d="M39.6917 40.7008V38.6199L6.88684 14.7497L7.55846 14.2539L40.4624 38.1991V40.1647L39.6917 40.7008Z"
          fill={brick ?? "#9A9A9A"}
        />
      </G>
    )}
    {center?.color1 && center?.color2 && (
      <G>
        <Path
          d="M29.9258 40.2936C28.1091 40.2936 26.287 39.7344 24.7345 38.6104L5.70341 24.8624C4.74002 24.1649 4.16749 23.0235 4.16199 21.7957C4.16199 20.5737 4.73452 19.4208 5.6924 18.7233L25.3291 4.43925C27.9495 2.53125 31.4728 2.52547 34.0987 4.42194L53.939 18.7579C54.9024 19.4554 55.475 20.5967 55.4805 21.8246C55.486 23.0524 54.9079 24.1937 53.95 24.897L35.1391 38.5873C33.5812 39.7229 31.748 40.2936 29.9203 40.2936H29.9258ZM6.14382 24.1995L25.1749 37.9475C28.0321 40.0111 31.8636 40.0054 34.7097 37.9302L53.5207 24.2398C54.2859 23.6864 54.7208 22.8045 54.7208 21.8361C54.7208 20.8677 54.2803 19.9857 53.5151 19.4324L33.6748 5.09636C31.3131 3.39011 28.1422 3.39589 25.786 5.1079L6.14932 19.392C5.38411 19.9454 4.94921 20.8273 4.94921 21.7957C4.94921 22.7699 5.38962 23.6461 6.15483 24.1995H6.14382Z"
          fill={brick ?? center.color1 ?? "#9A9A9A"}
        />
        <Path
          d="M6.29235 24.4755L25.0482 37.9698C28.01 40.1026 31.9296 40.0911 34.8803 37.9526L53.4215 24.5158C55.2161 23.2131 55.2106 20.4404 53.4104 19.1434L33.8509 5.07838C31.3791 3.2972 28.109 3.30297 25.6373 5.08992L6.27584 19.1089C4.47567 20.4116 4.48118 23.1843 6.28135 24.4812L6.29235 24.4755Z"
          fill={center.color2 ?? "#D6D6D6"}
        />
      </G>
    )}
    <Defs>
      <LinearGradient
        id="colors"
        x1="0.00549316"
        y1="30.3424"
        x2="60"
        y2="30.3424"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0.45" stopColor={colors.color1 ?? "#E75033"} />
        <Stop offset="0.55" stopColor={colors.color2 ?? "#C12E27"} />
      </LinearGradient>
      {double?.color1 && double?.color2 && (
        <LinearGradient
          id="douleColor"
          x1="0.00550509"
          y1="23.6744"
          x2="60"
          y2="23.6744"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.45" stopColor={double.color1} />
          <Stop offset="0.55" stopColor={double.color2} />
        </LinearGradient>
      )}
    </Defs>
  </Svg>
);

const YellowBox = ({
  size = 60,
  zIndex = 1,
  left = 0,
  bottom = 0,
}: {
  size: number;
  zIndex: number;
  left: number;
  bottom: number;
}) => (
  <View
    style={{
      position: "absolute",
      zIndex,
      left,
      bottom,
    }}
  >
    <Box
      size={size}
      colors={{ color1: "#D7A234", color2: "#AB7A2C" }}
      cover="#FFD159"
    />
  </View>
);

const GreyBox = ({
  size = 60,
  zIndex = 1,
  left = 0,
  bottom = 0,
}: {
  size: number;
  zIndex: number;
  left: number;
  bottom: number;
}) => (
  <View
    style={{
      position: "absolute",
      zIndex,
      left,
      bottom,
    }}
  >
    <Box
      size={size}
      center={{ color1: "#9A9A9A", color2: "#D6D6D6" }}
      brick="#9A9A9A"
      double={{ color1: "#ADAFB2", color2: "#8D9092" }}
    />
  </View>
);

const BlueBox = ({
  size = 60,
  zIndex = 1,
  left = 0,
  bottom = 0,
}: {
  size: number;
  zIndex: number;
  left: number;
  bottom: number;
}) => (
  <View
    style={{
      position: "absolute",
      zIndex,
      left,
      bottom,
    }}
  >
    <Box
      size={size}
      colors={{ color1: "#428AC9", color2: "#2B67B2" }}
      cover="#3D71B0"
      center={{ color2: "#3D71B0", color1: "#5F9CD9" }}
    />
  </View>
);

const GreenBox = ({
  size = 60,
  zIndex = 1,
  left = 0,
  bottom = 0,
}: {
  size: number;
  zIndex: number;
  left: number;
  bottom: number;
}) => (
  <View
    style={{
      position: "absolute",
      zIndex,
      left,
      bottom,
    }}
  >
    <Box
      size={size}
      colors={{ color1: "#4BAB48", color2: "#359043" }}
      cover="#98CA4C"
      center={{ color2: "#81C342", color1: "#51935D" }}
    />
  </View>
);

const RedBox = ({
  size = 60,
  zIndex = 1,
  left = 0,
  bottom = 0,
}: {
  size: number;
  zIndex: number;
  left: number;
  bottom: number;
}) => (
  <View
    style={{
      position: "absolute",
      zIndex,
      left,
      bottom,
    }}
  >
    <Box
      size={size}
      colors={{ color1: "#E75033", color2: "#C12E27" }}
      cover="#F2643F"
      center={{ color2: "#E65031", color1: "#E24C29" }}
    />
  </View>
);

const OrangeBox = ({
  size = 60,
  zIndex = 1,
  left = 0,
  bottom = 0,
}: {
  size: number;
  zIndex: number;
  left: number;
  bottom: number;
}) => (
  <View
    style={{
      position: "absolute",
      zIndex,
      left,
      bottom,
    }}
  >
    <Box
      size={size}
      colors={{ color1: "#ff963f", color2: "#d48744" }}
      cover="#ff792b"
    />
  </View>
);

export default Box;

export { BlueBox, GreenBox, GreyBox, OrangeBox, RedBox, YellowBox };

/*
      <View style={styles.container}>
        <RedBox
          size={60}
          zIndex={9983}
          left={center - 105}
          bottom={inset.bottom + 445}
        />
        <GreenBox
          size={60}
          zIndex={9984}
          left={center - 145}
          bottom={inset.bottom + 428}
        />
        <GreyBox
          size={60}
          zIndex={9985}
          left={center - 170}
          bottom={inset.bottom + 395}
        />
        <BlueBox
          size={75}
          zIndex={9986}
          left={center - 130}
          bottom={inset.bottom + 370}
        />
        <YellowBox
          size={60}
          zIndex={9987}
          left={center - 78}
          bottom={inset.bottom + 353}
        />
        <GreenBox
          size={60}
          zIndex={9988}
          left={center - 35}
          bottom={inset.bottom + 335}
        />
        <GreyBox
          size={60}
          zIndex={9989}
          left={center + 10}
          bottom={inset.bottom + 318}
        />
        <RedBox
          size={60}
          zIndex={9990}
          left={center + 55}
          bottom={inset.bottom + 305}
        />
        <BlueBox
          size={75}
          zIndex={9991}
          left={center + 65}
          bottom={inset.bottom + 266}
        />
        <YellowBox
          size={60}
          zIndex={9992}
          left={center + 35}
          bottom={inset.bottom + 243}
        />
        <GreyBox
          size={60}
          zIndex={9992}
          left={center - 10}
          bottom={inset.bottom + 227}
        />
        <YellowBox
          size={60}
          zIndex={9993}
          left={center - 50}
          bottom={inset.bottom + 208}
        />
        <BlueBox
          size={60}
          zIndex={9994}
          left={center - 75}
          bottom={inset.bottom + 175}
        />
        <RedBox
          size={75}
          zIndex={9995}
          left={center - 105}
          bottom={inset.bottom + 135}
        />
        <GreyBox
          size={60}
          zIndex={9996}
          left={center - 60}
          bottom={inset.bottom + 112}
        />
        <YellowBox
          size={60}
          zIndex={9997}
          left={center - 40}
          bottom={inset.bottom + 78}
        />
        <GreyBox
          size={60}
          zIndex={9998}
          left={center - 15}
          bottom={inset.bottom + 45}
        />
        <GreenBox
          size={75}
          zIndex={9999}
          left={center + 25}
          bottom={inset.bottom + 25}
        />
      </View>
      */

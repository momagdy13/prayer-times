import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";
import { Select } from "@mui/material";
export default function MainContent() {
  const [today, setToday] = useState("16 يناير 2024 | 5 : 20");
  const prayerArray = [
    { key: "الفجر", displayPrayer: "Fajr" },
    { key: "الظهر", displayPrayer: "Duhr" },
    { key: "العصر", displayPrayer: "Asr" },
    { key: "المغرب", displayPrayer: "Maghrib" },
    { key: "العشاء", displayPrayer: "Isha" },
  ];
  const [remainingTime, setRemainigTime] = useState("");

  const handleCityChange = (event) => {
    const cityName = Cities.find((city) => {
      return city.apiName == event.target.value;
    });

    console.log(cityName?.apiName);
    setSelectedCity(cityName);
  };
  const [nextPrayerIndex, setNextPrayerIndex] = useState(1);

  const [selectedCity, setSelectedCity] = useState({
    apiName: "Cairo",
    displayName: "القاهره",
  });
  const [timing, setTiming] = useState({
    Fajr: "05:20",
    Dhuhr: "12:04",
    Asr: "14:57",
    Maghrib: "17:17",
    Isha: "18:39",
  });

  const getTiming = async () => {
    const responce = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`
    );

    setTiming(responce.data.data.timings);
  };
  const Cities = [
    { displayName: "القاهره", apiName: "Cairo" },
    { displayName: "الاسكندريه", apiName: "Alexandria" },
  ];

  useEffect(() => {
    getTiming();
  }, [selectedCity]);

  const hanleCounTimeDown = () => {
    let prayerIndex = null;
    let momentNow = moment();

    if (
      momentNow.isAfter(moment(timing.Fajr, "hh:mm")) &&
      momentNow.isBefore(moment(timing.Dhuhr, "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timing.Dhuhr, "hh:mm")) &&
      momentNow.isBefore(moment(timing.Asr, "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timing.Asr, "hh:mm")) &&
      momentNow.isBefore(moment(timing.Maghrib, "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timing.Maghrib, "hh:mm")) &&
      momentNow.isBefore(moment(timing.Isha, "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayerArray[prayerIndex];
    const prayerTimer = timing[nextPrayerObject.displayPrayer];
    let remainingTime = moment(prayerTimer, "hh:mm").diff(momentNow);
    const nextPrayerTimeMoment = moment(prayerTimer, "hh,mm");

    if (remainingTime < 0) {
      const midNight = moment("23:59:59", "hh,mm,ss").diff(momentNow);
      const FajerDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh,mm,ss")
      );
      let totalDiff = midNight + FajerDiff;
      remainingTime = totalDiff;
    }
    let durationRemainingTime = moment.duration(remainingTime);

    setRemainigTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  };

  useEffect(() => {
    setToday(moment().format("MMM Do YYYY | h:mm"));
    hanleCounTimeDown();
    const intervar = setInterval(() => {
      hanleCounTimeDown();
    }, 1000);
    return () => {
      clearInterval(intervar);
    };
  }, [timing]);

  return (
    <>
      <Grid container>
        <Grid xs={6}>
          <div>
            <h1> {today}</h1>
            <h2> {selectedCity.displayName}</h2>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h1> المتبقي على صلاه {prayerArray[nextPrayerIndex].key} </h1>
            <h2> {remainingTime} </h2>
          </div>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: "white", marginBottom: "30px" }} />

      <Stack direction={"row"}>
        <Prayer
          name="الفجر"
          time={timing.Fajr}
          image="./image/fajr-prayer.png"
        />
        <Prayer
          name="الظهر"
          time={timing.Dhuhr}
          image="./image/dhhr-prayer-mosque.png"
        />
        <Prayer
          name="العصر"
          time={timing.Asr}
          image="./image/asr-prayer-mosque.png"
        />
        <Prayer
          name="المغرب"
          time={timing.Maghrib}
          image="./image/sunset-prayer-mosque.png"
        />
        <Prayer
          name="العشاء"
          time={timing.Isha}
          image="./image/night-prayer-mosque.png"
        />
      </Stack>
      <Stack direction={"row"} justifyContent={"center"}>
        <FormControl style={{ width: "30%", marginTop: "20px" }}>
          <InputLabel id="demo-simple-select-label" style={{ color: "white" }}>
            المدينه
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="المدينه"
            onChange={handleCityChange}
          >
            {Cities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

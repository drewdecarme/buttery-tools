import { Command } from "commander";
import { addHours, format, subMonths } from "date-fns";
import type { GetSingleDeviceApiResponse } from "@machineq/models";
import { checkbox, input } from "@inquirer/prompts";

import {
  convertDateToEpochTimestamp,
  createRandomNumber,
  createSensorData,
  validateDate
} from "./data.utils.js";

import { api } from "../fetch/index.js";
import { logger } from "../utils/util.logger.js";

export const commandDataCreateSensorHistory = new Command(
  "sensor-history"
).description(
  "Creates a user defined number of sensor history records for a device"
);

async function command() {
  try {
    const deviceDbId = await input({
      message: "Device DB ID"
    });
    const device = await api.get<GetSingleDeviceApiResponse>({
      route: "/device",
      segments: deviceDbId
    });

    const selectedSensors = await checkbox({
      message:
        "Select the sensors enabled on this device that you wish to create historical entries for",
      choices: device.sensors.map((sensor) => ({
        name: sensor.sensor_model.name,
        value: sensor
      }))
    });

    const start_date = await input({
      message:
        "Enter the staring date of when to generate a history messages: (YYYY-MM-DD)",
      default: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
      validate: validateDate
    });

    const num_of_messages = await input({
      message: "How many location messages would you like to create?",
      default: "50"
    });

    const messagesNum = Number(num_of_messages);
    const startingDate = new Date(start_date);

    const iterations = [...Array(messagesNum)];
    for (let index = 0; index < iterations.length; index++) {
      // const date = subHours(startingDate, index);
      const date = addHours(startingDate, index);
      try {
        const body = {
          ts: convertDateToEpochTimestamp(date),
          ap: "2CC407FFFE100060",
          ct: "50001",
          dt: 2,
          batt: createRandomNumber({ max: 100 }).toString(),
          did: device.device_id,
          data: createSensorData(selectedSensors)
        };
        // Start Request
        console.log(`Processing aux-asset-data: [${index}]... start`);
        console.log(date.toString());
        console.log(JSON.stringify(body, null, 2));
        await api.fetch({
          route: "/process-aux-asset-data",
          method: "POST",
          body
        });

        console.log(`Processing aux-asset-data: [${index}]... end.`);
        console.log(`---------------------------------------------`);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    logger.error(error as string);
  }
}

commandDataCreateSensorHistory.action(command);

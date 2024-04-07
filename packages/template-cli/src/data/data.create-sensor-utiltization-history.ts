import { Command } from "commander";
import { addHours, addMonths, format } from "date-fns";
import type {
  GetAssetDeviceApiResponse,
  GetAssetInfoApiResponse
} from "@machineq/models";
import { input } from "@inquirer/prompts";

import type { FloorIds } from "./data.utils.js";
import { floorCoordinateListMap } from "./data.utils.js";

import { api } from "../fetch/index.js";
import { logger } from "../utils/util.logger.js";

export const commandDataSensorUtilHistory = new Command(
  "sensor-util-history"
).description(
  "Creates a user defined amount of utilization data for a given sensor on a device device paired to an asset"
);

async function command() {
  try {
    const assetDbId = await input({
      message: "Asset DB ID"
    });
    const asset = await api.get<GetAssetInfoApiResponse>({
      route: "/asset",
      segments: assetDbId
    });
    if (!asset.asset_device[0]) {
      throw "This asset does not have a device associated with it. Please tag the asset before continuing.";
    }

    const start_date = await input({
      message:
        "Enter the staring date of when to generate location messages: (YYYY-MM-DD)",
      default: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
      validate: (input) => {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!input.match(regEx))
          return "Invalid date format. Please enter a date with format (YYYY-MM-DD)"; // Invalid format
        const d = new Date(input);
        const dNum = d.getTime();
        if (!dNum && dNum !== 0) return false;
        ("Unable to parse date: Please enter a date with format (YYYY-MM-DD)"); // Invalid date NaN
        return d.toISOString().slice(0, 10) === input;
      }
    });

    const num_of_messages = await input({
      message: "How many location messages would you like to create?",
      default: "50"
    });
    const messagesNum = Number(num_of_messages);

    const assetDevice = await api.get<GetAssetDeviceApiResponse>({
      route: "/asset-device",
      segments: asset.asset_device[0].id
    });

    const mac_address = asset.asset_device[0].device.mac_address;
    const floor_id = assetDevice.location_snapshot.floor.floor_id as FloorIds;

    if (!Object.keys(floorCoordinateListMap).includes(floor_id)) {
      throw `Floor ${floor_id} is currently not supported. Please ensure the tag on the asset was installed on one of the following floors: ${Object.keys(
        floorCoordinateListMap
      ).join(", ")}`;
    }

    const startingDate = new Date(start_date);
    const coordinateList = floorCoordinateListMap[floor_id];
    const dates = [...Array(messagesNum).keys()].map((_value, index) =>
      addHours(startingDate, index + 1)
    );

    for (let index = 0; index < dates.length; index++) {
      try {
        const randomCoordinateIndex = Math.floor(
          Math.random() * coordinateList.length
        );

        const coordinates = coordinateList[randomCoordinateIndex];
        const last_reported_at = dates[index];
        const last_reported_at_formatted = `${
          last_reported_at.toISOString().split(".")[0]
        }+00:00`;

        // Start Request
        console.log(
          "Creating location message at",
          coordinates,
          "on",
          last_reported_at.toLocaleDateString(),
          last_reported_at
        );
        const body = {
          tag_identifier: mac_address,
          last_reported_at: last_reported_at_formatted,
          floor_id,
          signal_strength: [
            {
              apid: "2CC407FFFE100090",
              readings: [
                { rssi: "-4", received_at: "2021-12-15T19:17:5+00:00" },
                { rssi: "-50", received_at: "2021-12-15T18:13:5+00:00" }
              ]
            }
          ],
          last_reported_location: {
            type: "Point",
            coordinates
          },
          status: "active",
          led: "inactive",
          battery_level: "12",
          confidence: "ROOM"
        };
        console.log(JSON.stringify(body));
        await api.fetch({
          route: "/location-message",
          method: "POST",
          body
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    logger.error(error as string);
  }
}

commandDataSensorUtilHistory.action(command);

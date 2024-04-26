import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { styled } from "@linaria/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { getPrismaClient } from "../utils/prisma";
import { z } from "zod";

const SDiv = styled("div")`
  display: grid;
  grid-template-rows: auto 1fr;
`;

const ClientSchema = z.object({
  name: z.string(),
  address_line_1: z.string(),
  address_line_2: z.string().optional(),
  address_line_3: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

export const action = async (args: ActionFunctionArgs) => {
  const { userId: user_id } = await getAuth(args);
  if (!user_id) throw new Error("Cannot locate user");
  const prisma = await getPrismaClient(args);

  try {
    const formData = await args.request.formData();
    const formDataObj = Object.fromEntries(formData.entries());
    const data = ClientSchema.parse(formDataObj);
    const client = await prisma.client.create({
      data: {
        ...data,
        user_id,
      },
    });
    return redirect(`/dashboard/clients/${client.name}`);
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export default function DashboardClientsPage() {
  return (
    <SDiv>
      <div>
        <h1>Create a new client</h1>
      </div>
      <Form method="post">
        <label>
          <div>Name</div>
          <input type="text" name="name" />
        </label>
        <label>
          <div>Address Line 1</div>
          <input type="text" name="address_line_1" />
        </label>
        <label>
          <div>Address Line 2</div>
          <input type="text" name="address_line_2" />
        </label>
        <label>
          <div>Address Line 3</div>
          <input type="text" name="address_line_3" />
        </label>
        <label>
          <div>City</div>
          <input type="text" name="city" />
        </label>
        <label>
          <div>State</div>
          <select id="us-states" name="state" defaultValue="">
            <option value=""></option>
            <option value="AL">AL - Alabama</option>
            <option value="AK">AK - Alaska</option>
            <option value="AZ">AZ - Arizona</option>
            <option value="AR">AR - Arkansas</option>
            <option value="CA">CA - California</option>
            <option value="CO">CO - Colorado</option>
            <option value="CT">CT - Connecticut</option>
            <option value="DE">DE - Delaware</option>
            <option value="DC">DC - District Of Columbia</option>
            <option value="FL">FL - Florida</option>
            <option value="GA">GA - Georgia</option>
            <option value="HI">HI - Hawaii</option>
            <option value="ID">ID - Idaho</option>
            <option value="IL">IL - Illinois</option>
            <option value="IN">IN - Indiana</option>
            <option value="IA">IA - Iowa</option>
            <option value="KS">KS - Kansas</option>
            <option value="KY">KY - Kentucky</option>
            <option value="LA">LA - Louisiana</option>
            <option value="ME">ME - Maine</option>
            <option value="MD">MD - Maryland</option>
            <option value="MA">MA - Massachusetts</option>
            <option value="MI">MI - Michigan</option>
            <option value="MN">MN - Minnesota</option>
            <option value="MS">MS - Mississippi</option>
            <option value="MO">MO - Missouri</option>
            <option value="MT">MT - Montana</option>
            <option value="NE">NE - Nebraska</option>
            <option value="NV">NV - Nevada</option>
            <option value="NH">NH - New Hampshire</option>
            <option value="NJ">NJ - New Jersey</option>
            <option value="NM">NM - New Mexico</option>
            <option value="NY">NY - New York</option>
            <option value="NC">NC - North Carolina</option>
            <option value="ND">ND - North Dakota</option>
            <option value="OH">OH - Ohio</option>
            <option value="OK">OK - Oklahoma</option>
            <option value="OR">OR - Oregon</option>
            <option value="PA">PA - Pennsylvania</option>
            <option value="RI">RI - Rhode Island</option>
            <option value="SC">SC - South Carolina</option>
            <option value="SD">SD - South Dakota</option>
            <option value="TN">TN - Tennessee</option>
            <option value="TX">TX - Texas</option>
            <option value="UT">UT - Utah</option>
            <option value="VT">VT - Vermont</option>
            <option value="VA">VA - Virginia</option>
            <option value="WA">WA - Washington</option>
            <option value="WV">WV - West Virginia</option>
            <option value="WI">WI - Wisconsin</option>
            <option value="WY">WY - Wyoming</option>
          </select>
        </label>
        <label>
          <div>Zip</div>
          <input type="number" name="zip" />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </SDiv>
  );
}

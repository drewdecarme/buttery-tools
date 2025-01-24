import { useModal } from "@buttery/components";

import { Button } from "~/components/Button";
import { ModalBody } from "~/components/ModalBody";
import { ModalDrawer } from "~/components/ModalDrawer";
import { ModalHeader } from "~/components/ModalHeader";
import { NavTab } from "~/components/NavTab";
import { NavTabContent } from "~/components/NavTabContent";
import { NavTabLabel } from "~/components/NavTabLabel";
import { NavTabs } from "~/components/NavTabs";
import { IconHelpCircle } from "~/icons/IconHelpCircle";

export function FontFamilyPreviewControlsHelp() {
  const { modalRef, openModal } = useModal();
  return (
    <>
      <Button
        dxVariant="icon"
        DXIcon={IconHelpCircle}
        dxStyle="outlined"
        dxSize="normal"
        onClick={openModal}
        dxHelp="Help"
      />
      <ModalDrawer ref={modalRef} dxVariant="right-to-left" dxSize="lg">
        <ModalHeader>Font family help</ModalHeader>
        <ModalBody>
          <NavTabs dxInitActiveTab="general">
            <ul>
              <li>
                <NavTab id="general">
                  <NavTabLabel>General</NavTabLabel>
                  <NavTabContent>Tab 1 content</NavTabContent>
                </NavTab>
              </li>
              <li>
                <NavTab id="faqs">
                  <NavTabLabel>FAQs</NavTabLabel>
                  <NavTabContent>
                    <h3>
                      The font styles aren&apos;t displaying when I select a
                      style
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia est doloremque dignissimos architecto a, eum
                      distinctio eius labore similique laboriosam facere laborum
                      blanditiis autem iusto unde error fugit eaque neque!
                    </p>
                    <h3>Question 2</h3>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia est doloremque dignissimos architecto a, eum
                      distinctio eius labore similique laboriosam facere laborum
                      blanditiis autem iusto unde error fugit eaque neque!
                    </p>
                  </NavTabContent>
                </NavTab>
              </li>
            </ul>
          </NavTabs>
        </ModalBody>
      </ModalDrawer>
    </>
  );
}

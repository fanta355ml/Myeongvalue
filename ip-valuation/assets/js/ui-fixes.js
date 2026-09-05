(() => {
        const applyFunctionalFixes = () => {
          const referenceSource = document.querySelector(
            ".reference-data-manager summary small",
          );
          if (
            referenceSource &&
            referenceSource.textContent.includes(
              "KoDATA 로열티공제법2 샘플 엑셀",
            )
          ) {
            referenceSource.textContent = "2026-08-20";
          }

          document
            .querySelectorAll(".manual-patent-grid label")
            .forEach((label) => {
              const caption = label.querySelector(":scope > span");
              const input = label.querySelector(":scope > input");
              if (
                input &&
                (caption?.textContent === "출원일" ||
                  caption?.textContent === "등록일")
              ) {
                if (input.type !== "text") input.type = "text";
                input.placeholder =
                  "YYYY-MM-DD / YYYY.MM.DD / YYYY/MM/DD";
                input.inputMode = "numeric";
              }
            });

          document
            .querySelectorAll(".report-editor-card")
            .forEach((card) => {
              const caption = card.querySelector(":scope > span");
              const input = card.querySelector(":scope > input");
              if (caption?.textContent !== "가치평가금액" || !input) return;

              card.classList.add("report-amount-editor-card");
              if (card.querySelector(".report-amount-reset-button")) return;

              const button = document.createElement("button");
              button.className = "report-amount-reset-button";
              button.type = "button";
              button.textContent = "자동가액으로 초기화";
              button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const setter = Object.getOwnPropertyDescriptor(
                  HTMLInputElement.prototype,
                  "value",
                )?.set;
                setter?.call(input, "");
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.focus();
              });
              input.insertAdjacentElement("afterend", button);
            });
        };

        const root = document.getElementById("root");
        if (root) {
          new MutationObserver(applyFunctionalFixes).observe(root, {
            childList: true,
            subtree: true,
          });
        }
        window.addEventListener("DOMContentLoaded", applyFunctionalFixes);
        requestAnimationFrame(applyFunctionalFixes);
      })();

(() => {
        const CARD_ID = "basicValuationMethodSelector";
        const METHOD_STORAGE_KEY = "ip-valuation-current-method";

        const setNativeSelectValue = (select, value) => {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLSelectElement.prototype,
            "value",
          )?.set;
          setter?.call(select, value);
          select.dispatchEvent(new Event("change", { bubbles: true }));
        };

        const applyValuationMethodPlacement = () => {
          const basicGrid = document.querySelector(".basic-grid");
          const purposeCard = basicGrid?.querySelector(".valuation-purpose-card");
          const engineSelect = document.querySelector(
            ".valuation-method-grid .valuation-method-selector select",
          );
          if (!basicGrid || !purposeCard || !engineSelect) return;

          let card = document.getElementById(CARD_ID);
          if (!card) {
            card = document.createElement("article");
            card.id = CARD_ID;
            card.className =
              "stage-card span-2 valuation-method-selector basic-valuation-method-selector";
            card.innerHTML = `
              <label>
                <span>평가방법 선택</span>
                <select aria-label="평가방법 선택">
                  <option value="royaltyDeduction2">로열티공제법Ⅱ</option>
                  <option value="royaltyDeduction1">로열티공제법Ⅰ</option>
                  <option value="discountedCashFlow">DCF · 업데이트 예정</option>
                </select>
              </label>
              <div class="valuation-method-planned-note" role="status" hidden>
                <strong>DCF 평가모형은 업데이트 예정입니다.</strong>
                <span>현재 저장·계산 중인 로열티공제법 모형과 입력값은 변경되지 않습니다.</span>
              </div>`;
            purposeCard.insertAdjacentElement("afterend", card);

            const proxySelect = card.querySelector("select");
            proxySelect?.addEventListener("change", () => {
              const requestedMethod = proxySelect.value;
              const currentEngineSelect = document.querySelector(
                ".valuation-method-grid .valuation-method-selector select",
              );
              if (!currentEngineSelect) return;
              setNativeSelectValue(currentEngineSelect, requestedMethod);
              if (requestedMethod !== "discountedCashFlow") {
                window.localStorage.setItem(
                  METHOD_STORAGE_KEY,
                  requestedMethod,
                );
              }
              requestAnimationFrame(applyValuationMethodPlacement);
            });
          } else if (card.previousElementSibling !== purposeCard) {
            purposeCard.insertAdjacentElement("afterend", card);
          }

          const selectedMethod =
            window.localStorage.getItem(METHOD_STORAGE_KEY) ||
            engineSelect.value ||
            "royaltyDeduction2";
          const proxySelect = card.querySelector("select");
          if (proxySelect) proxySelect.value = selectedMethod;

          const engineNotice = document.querySelector(
            ".valuation-method-grid .valuation-method-planned-note",
          );
          const proxyNotice = card.querySelector(
            ".valuation-method-planned-note",
          );
          const shouldHideNotice = !engineNotice;
          if (
            proxyNotice &&
            proxyNotice.hidden !== shouldHideNotice
          ) {
            proxyNotice.hidden = shouldHideNotice;
          }
        };

        const root = document.getElementById("root");
        if (root) {
          new MutationObserver(applyValuationMethodPlacement).observe(root, {
            attributes: true,
            childList: true,
            subtree: true,
          });
        }
        window.addEventListener(
          "DOMContentLoaded",
          applyValuationMethodPlacement,
        );
        requestAnimationFrame(applyValuationMethodPlacement);
      })();

(() => {
        const applyUiFixes = () => {
          const brandSubtitle = document.querySelector(".brand span");
          if (
            brandSubtitle &&
            brandSubtitle.textContent !== "IP & Technology Valuation"
          ) {
            brandSubtitle.textContent = "IP & Technology Valuation";
          }
        };

        const root = document.getElementById("root");
        if (root) {
          new MutationObserver(applyUiFixes).observe(root, {
            childList: true,
            subtree: true,
          });
        }
        window.addEventListener("DOMContentLoaded", applyUiFixes);
        requestAnimationFrame(applyUiFixes);
      })();

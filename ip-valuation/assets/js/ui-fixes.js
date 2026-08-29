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

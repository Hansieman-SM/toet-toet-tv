"""Zet een kleurcompositie (op wit) om naar een kleurplaat: zwarte contouren, heel donkere vlakken (pupillen, wielen) massief zwart."""
import sys, cv2, numpy as np
src, out = sys.argv[1], sys.argv[2]
im = cv2.imread(src)
sc = im.shape[1] / 1920
sm = cv2.bilateralFilter(im, 9, 40, 9)
lab = cv2.cvtColor(sm, cv2.COLOR_BGR2LAB).astype(np.float32)
g = np.zeros(im.shape[:2], np.float32)
for c in range(3):
    gx = cv2.Sobel(lab[:, :, c], cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(lab[:, :, c], cv2.CV_32F, 0, 1, ksize=3)
    g = np.maximum(g, np.hypot(gx, gy))
e = (g > 45).astype(np.uint8)
dark = (lab[:, :, 0] < 60).astype(np.uint8)          # L < ~27%: massief zwart
e = np.maximum(e, dark)
n, lb, st, _ = cv2.connectedComponentsWithStats(e, 8)
keep = np.zeros(n, bool); keep[1:] = st[1:, cv2.CC_STAT_AREA] > int(60 * sc * sc)
e = keep[lb].astype(np.uint8) * 255
e = cv2.morphologyEx(e, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
k = max(3, int(round(2 * sc)) | 1)
e = cv2.dilate(e, np.ones((k, k), np.uint8))
cv2.imwrite(out, 255 - e)

import sys

def make_pdf(path, title, lines):
    content_lines = []
    y = 760
    content_lines.append("BT /F1 22 Tf 60 %d Td (%s) Tj ET" % (y, esc(title)))
    y -= 40
    content_lines.append("BT /F2 12 Tf 60 %d Td (%s) Tj ET" % (y, esc("")))
    for line in lines:
        y -= 24
        content_lines.append("BT /F2 12 Tf 60 %d Td (%s) Tj ET" % (y, esc(line)))
    stream = "\n".join(content_lines).encode("latin-1")

    objects = []
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    objects.append(b"<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595 842] /Contents 6 0 R >>")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    stream_obj = b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream"
    objects.append(stream_obj)

    pdf = bytearray()
    pdf += b"%PDF-1.4\n"
    offsets = [0]
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf += ("%d 0 obj\n" % i).encode("latin-1")
        pdf += obj
        pdf += b"\nendobj\n"
    xref_offset = len(pdf)
    pdf += ("xref\n0 %d\n" % (len(objects) + 1)).encode("latin-1")
    pdf += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        pdf += ("%010d 00000 n \n" % off).encode("latin-1")
    pdf += b"trailer\n"
    pdf += ("<< /Size %d /Root 1 0 R >>\n" % (len(objects) + 1)).encode("latin-1")
    pdf += b"startxref\n"
    pdf += (str(xref_offset) + "\n").encode("latin-1")
    pdf += b"%%EOF"

    with open(path, "wb") as f:
        f.write(pdf)

def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")

if __name__ == "__main__":
    make_pdf(
        sys.argv[1],
        "TAU-TURAN RESORT",
        [
            "Corporate & Team-Building Presentation (placeholder)",
            "",
            "This is a placeholder PDF file.",
            "Replace it via the admin panel with the final",
            "corporate presentation once it is ready.",
            "",
            "Contact: tauturaninfo@gmail.com",
            "WhatsApp: +7 727 983 6690",
        ],
    )
    print("written", sys.argv[1])

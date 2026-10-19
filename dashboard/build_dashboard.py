from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "ssc_ase_2021_julio1.csv"
OUT_PATH = Path(__file__).resolve().parent / "data.js"


def parse_int(value: str) -> int:
    value = value.strip()
    return int(value) if value else 0


def parse_float(value: str):
    value = value.strip()
    if not value:
        return None
    return float(value.replace(".", "").replace(",", "."))


def main() -> None:
    with CSV_PATH.open("r", encoding="cp1252", newline="") as f:
        rows = list(csv.reader(f, delimiter=";"))

    header = rows[0]
    data = rows[1:]
    months = header[7:]

    records = []
    zones = set()
    provinces = set()
    cantons = set()
    genders = set()
    statuses = set()
    provinces_by_zone = {}
    cantons_by_province = {}

    for row in data:
        zone, province, canton, gender, seguro, status, aporte_raw = row[:7]
        month_values = [parse_int(v) for v in row[7:]]
        total = sum(month_values)
        aporte = parse_float(aporte_raw)

        zones.add(zone)
        provinces.add(province)
        cantons.add(canton)
        genders.add(gender)
        statuses.add(status)
        provinces_by_zone.setdefault(zone, set()).add(province)
        cantons_by_province.setdefault(province, set()).add(canton)

        records.append(
            {
                "zone": zone,
                "province": province,
                "canton": canton,
                "gender": gender,
                "seguro": seguro,
                "status": status,
                "aporte": aporte,
                "months": month_values,
                "total": total,
            }
        )

    payload = {
        "months": months,
        "records": records,
        "dimensions": {
            "zones": sorted(zones, key=int),
            "provinces": sorted(provinces),
            "cantons": sorted(cantons),
            "genders": sorted(genders),
            "statuses": sorted(statuses),
            "provincesByZone": {
                zone: sorted(values) for zone, values in sorted(provinces_by_zone.items(), key=lambda item: int(item[0]))
            },
            "cantonsByProvince": {province: sorted(values) for province, values in sorted(cantons_by_province.items())},
        },
    }

    OUT_PATH.write_text(
        "window.SSC_DASHBOARD = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_PATH.relative_to(ROOT)} with {len(records)} records.")


if __name__ == "__main__":
    main()

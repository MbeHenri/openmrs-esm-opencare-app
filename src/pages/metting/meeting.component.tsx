import React, { useCallback, useState } from "react";
import classnames from "classnames";
import RoomButton from "../../components/RoomButton";
import {
  fhirBaseUrl,
  openmrsFetch,
  restBaseUrl,
  usePatient,
  useSession,
} from "@openmrs/esm-framework";
import { useParams } from "react-router";
import { Search } from "@carbon/react";
import { Button } from "@carbon/react";

export function Meeting(): React.JSX.Element {
  //const [url, setUrl] = useState<string | null>(null);

  const cd = useParams();

  // get a current User Id
  const user = useSession().user;

  /* const patients = [
    {
      name: "Sarah",
      uuid: "8139a315-7578-4802-9c55-3addbf7216dc",
      Identifier: "10EEnn",
    },
  ]; */

  const [patients, setPatients] = useState([]);

  const [textSearch, setTextSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    try {
      setSearching(true);
      await fetch(
        `/openmrs${restBaseUrl}/patient?q=${textSearch}&v=custom:(uuid,patientIdentifier:(uuid,identifier),person:(gender,age,birthdate,birthdateEstimated,personName,addresses,display,dead,deathDate))`
      )
        .then((response) => response.json())
        .then((response) => {
          const data: Array<any> = response.results;
          setPatients(
            data.map((value) => {
              return {
                name: value.person.display,
                uuid: value.uuid,
                Identifier: value.patientIdentifier.identifier,
              };
            })
          );
          setSearching(false);
        });
    } catch (error) {
      setSearching(false);
    }
  }, [textSearch]);

  return (
    <main className={classnames("omrs-main-content")}>
      {/* Bouton de recherche des patients */}
      <div style={{ display: "flex" }}>
        <Search
          size="lg"
          placeholder="Find your patients"
          labelText="Search"
          closeButtonLabelText="Clear"
          id="search-1"
          onChange={(e) => setTextSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter" && !searching) {
              handleSearch();
            }
          }}
        />
        <Button
          onClick={() => {
            if (!searching) {
              handleSearch();
            }
          }}
        >
          {searching ? "searching ..." : "search"}{" "}
        </Button>
      </div>

      {/* Liste des patient */}
      <div
        style={{ display: "flex", flexWrap: "wrap", margin: "4rem", gap: 10 }}
      >
        {!searching ? (
          patients.length > 0 ? (
            patients.map((value, i) => {
              return (
                <div key={`patient-${i}`}>
                  <p style={{ marginRight: "1rem" }}>{value.Identifier}</p>
                  <p style={{ marginRight: "1rem" }}>{value.name}</p>
                  <RoomButton patientId={value.uuid} patientName={value.name} />
                </div>
              );
            })
          ) : (
            <p> Listes de patients vide </p>
          )
        ) : (
          <p> Recherche des patients ...</p>
        )}

        {/* <RoomButton
          patientId={"66c87fe5-6f31-46d8-bcb3-3e77c99563d0"}
          callback={(url: string) => {
            setUrl(url);
          }}
        /> */}
      </div>
    </main>
  );
}

package postgresql

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/18F/e-QIP-prototype/api"
	"github.com/18F/e-QIP-prototype/api/mock"
)

// readTestData pulls in test data as a string
func readTestData(filepath string) (string, error) {
	b, err := ioutil.ReadFile(filepath)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// readBinaryData pulls test data and returns it as a byte array.
func readBinaryData(filepath string) ([]byte, error) {
	b, err := ioutil.ReadFile(filepath)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func TestCollections(t *testing.T) {
	settings := mock.Native{}
	settings.Configure()
	service := &Service{Log: &mock.LogService{Off: true}, Env: settings}
	service.Configure()
	account := 1

	tests := []struct {
		Data  string
		Items int
	}{
		{Data: "testdata/accordion.json", Items: 1},
		{Data: "testdata/branchcollection.json", Items: 2},
	}

	for _, test := range tests {
		// Purge the account
		api.PurgeAccountStorage(service, account)

		// Get the test data as a byte array
		raw, err := readBinaryData(test.Data)
		if err != nil {
			t.Fatal(err)
		}

		// Deserialize the initial payload from a JSON structure
		payload := &api.Payload{}
		if err := payload.Unmarshal(raw); err != nil {
			t.Fatalf("Failed to deserialize JSON: %v\n:Error: %v\n", string(raw), err)
		}

		// Extract the entity interface of the payload and validate it
		entity, err := payload.Entity()
		if err != nil {
			t.Fatalf("Failed to unpackage the payload for [%s]: %v", test.Data, err)
		}
		if ok, err := entity.Valid(); !ok {
			t.Fatalf("Error with [%s]: %v\n\nEntity: %v", test.Data, err, entity)
		}

		id, err := entity.Save(service, account)
		if err != nil {
			t.Fatalf("Error saving [%s]: %v\n\nEntity: %v", test.Data, err, entity)
		}

		savedEntity := &api.Collection{ID: id}
		if _, err := savedEntity.Get(service, account); err != nil {
			t.Fatalf("Error getting [%s]: %v\n\nEntity: %v", test.Data, err, savedEntity)
		}
		if savedEntity.BranchID == 0 {
			t.Fatalf("Collection branch ID was not returned")
		} else {
			log.Println("collection branch id", savedEntity.Branch.ID)
			log.Println("collection branch value", savedEntity.Branch.Value)
		}

		savedItems := len(savedEntity.Items)
		if savedItems != test.Items {
			t.Fatalf("Collection did not have %d items but was %d", test.Items, savedItems)
		}
		if _, err := savedEntity.Delete(service, account); err != nil {
			t.Fatalf("Error deleting [%s]: %v\n\nEntity: %v", test.Data, err, savedEntity)
		}
	}
}

func TestPayloadValidate(t *testing.T) {
	tests := []struct {
		Data string
	}{
		{Data: "testdata/accordion.json"},
		{Data: "testdata/branch.json"},
		{Data: "testdata/branchcollection.json"},
		{Data: "testdata/checkbox.json"},
		{Data: "testdata/civilunion.json"},
		{Data: "testdata/clearancelevel.json"},
		{Data: "testdata/country.json"},
		{Data: "testdata/datecontrol.json"},
		{Data: "testdata/daterange.json"},
		{Data: "testdata/email.json"},
		{Data: "testdata/employmentactivity.json"},
		{Data: "testdata/foreignborndocument.json"},
		{Data: "testdata/height.json"},
		{Data: "testdata/location.json"},
		{Data: "testdata/name.json"},
		{Data: "testdata/notapplicable.json"},
		{Data: "testdata/number.json"},
		{Data: "testdata/physicaladdress.json"},
		{Data: "testdata/radio.json"},
		{Data: "testdata/reasonleft.json"},
		{Data: "testdata/sentence.json"},
		{Data: "testdata/signature.json"},
		{Data: "testdata/ssn.json"},
		{Data: "testdata/supervisor.json"},
		{Data: "testdata/telephone.json"},
		{Data: "testdata/text.json"},
		{Data: "testdata/textarea.json"},

		// Section: Identification
		{Data: "testdata/identification-birthdate.json"},
		{Data: "testdata/identification-birthplace.json"},
		{Data: "testdata/identification-contacts.json"},
		{Data: "testdata/identification-name.json"},
		{Data: "testdata/identification-othernames.json"},
		{Data: "testdata/identification-physical.json"},
		{Data: "testdata/identification-ssn.json"},
		{Data: "testdata/identification-comments.json"},

		// Section: Financial
		{Data: "testdata/financial-bankruptcy.json"},
		{Data: "testdata/financial-gambling.json"},
		{Data: "testdata/financial-taxes.json"},
		{Data: "testdata/financial-card.json"},
		{Data: "testdata/financial-credit.json"},
		{Data: "testdata/financial-delinquent.json"},
		{Data: "testdata/financial-nonpayment.json"},
		{Data: "testdata/financial-comments.json"},

		// Section: Your history
		{Data: "testdata/history-residence.json"},
		{Data: "testdata/history-employment.json"},
		{Data: "testdata/history-education.json"},
		{Data: "testdata/history-federal.json"},
		{Data: "testdata/history-comments.json"},

		// Section: Relationships
		{Data: "testdata/relationships-status-marital.json"},
		{Data: "testdata/relationships-status-cohabitant.json"},
		{Data: "testdata/relationships-people.json"},
		{Data: "testdata/relationships-relatives.json"},
		{Data: "testdata/relationships-comments.json"},

		// Section: Citizenship
		{Data: "testdata/citizenship-status.json"},
		{Data: "testdata/citizenship-multiple.json"},
		{Data: "testdata/citizenship-passports.json"},
		{Data: "testdata/citizenship-comments.json"},

		// Section: Military history
		{Data: "testdata/military-selective.json"},
		{Data: "testdata/military-history.json"},
		{Data: "testdata/military-foreign.json"},
		{Data: "testdata/military-disciplinary.json"},
		{Data: "testdata/military-comments.json"},

		// Section: Foreign activities
		{Data: "testdata/foreign-passport.json"},
		{Data: "testdata/foreign-contacts.json"},
		{Data: "testdata/foreign-travel.json"},
		{Data: "testdata/foreign-activities-benefits.json"},
		{Data: "testdata/foreign-activities-direct.json"},
		{Data: "testdata/foreign-activities-indirect.json"},
		{Data: "testdata/foreign-activities-realestate.json"},
		{Data: "testdata/foreign-activities-support.json"},
		{Data: "testdata/foreign-business-advice.json"},
		{Data: "testdata/foreign-business-conferences.json"},
		{Data: "testdata/foreign-business-contact.json"},
		{Data: "testdata/foreign-business-employment.json"},
		{Data: "testdata/foreign-business-family.json"},
		{Data: "testdata/foreign-business-political.json"},
		{Data: "testdata/foreign-business-sponsorship.json"},
		{Data: "testdata/foreign-business-ventures.json"},
		{Data: "testdata/foreign-business-voting.json"},
		{Data: "testdata/foreign-comments.json"},

		// Section: Substance use
		{Data: "testdata/substance-drug-usage.json"},
		{Data: "testdata/substance-drug-purchase.json"},
		{Data: "testdata/substance-drug-clearance.json"},
		{Data: "testdata/substance-drug-publicsafety.json"},
		{Data: "testdata/substance-drug-misuse.json"},
		{Data: "testdata/substance-drug-ordered.json"},
		{Data: "testdata/substance-drug-voluntary.json"},
		{Data: "testdata/substance-alcohol-negative.json"},
		{Data: "testdata/substance-alcohol-ordered.json"},
		{Data: "testdata/substance-alcohol-voluntary.json"},
		{Data: "testdata/substance-alcohol-additional.json"},
		{Data: "testdata/substance-comments.json"},

		// Section: Investigative and criminal history
		{Data: "testdata/legal-associations-activities-to-overthrow.json"},
		{Data: "testdata/legal-associations-advocating.json"},
		{Data: "testdata/legal-associations-engaged-in-terrorism.json"},
		{Data: "testdata/legal-associations-membership-overthrow.json"},
		{Data: "testdata/legal-associations-membership-violence-or-force.json"},
		{Data: "testdata/legal-associations-terrorism-association.json"},
		{Data: "testdata/legal-associations-terrorist-organization.json"},
		{Data: "testdata/legal-court.json"},
		{Data: "testdata/legal-investigations-debarred.json"},
		{Data: "testdata/legal-investigations-history.json"},
		{Data: "testdata/legal-investigations-revoked.json"},
		{Data: "testdata/legal-police-additionaloffenses.json"},
		{Data: "testdata/legal-police-domesticviolence.json"},
		{Data: "testdata/legal-police-offenses.json"},
		{Data: "testdata/legal-technology-manipulating.json"},
		{Data: "testdata/legal-technology-unauthorized.json"},
		{Data: "testdata/legal-technology-unlawful.json"},
		{Data: "testdata/legal-comments.json"},

		// Section: Psychological and emotional health
		{Data: "testdata/psychological-competence.json"},
		{Data: "testdata/psychological-consultations.json"},
		{Data: "testdata/psychological-hospitalizations.json"},
		{Data: "testdata/psychological-diagnoses.json"},
		{Data: "testdata/psychological-conditions.json"},
		{Data: "testdata/psychological-comments.json"},

		// Section: Submission
		{Data: "testdata/submission.json"},
	}

	// HTTP test server to field any third party requests
	xml, _ := readTestData("testdata/valid_address.xml")
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/xml")
		fmt.Fprintln(w, xml)
	}))
	defer server.Close()

	// Setup the geocoder to use our mock endpoint
	api.Geocode = mock.Geocoder{}

	for _, test := range tests {
		// Get the test data as a byte array
		raw, err := readBinaryData(test.Data)
		if err != nil {
			t.Fatal(err)
		}

		// Deserialize the initial payload from a JSON structure
		payload := &api.Payload{}
		if err := payload.Unmarshal(raw); err != nil {
			t.Fatalf("Failed to deserialize JSON: %v\n:Error: %v\n", string(raw), err)
		}

		// Extract the entity interface of the payload
		entity, err := payload.Entity()
		if err != nil {
			t.Fatalf("Failed to unpackage the payload for [%s]: %v", test.Data, err)
		}

		// Validate the entity
		if ok, err := entity.Valid(); !ok {
			t.Fatalf("Error with [%s]: %v\n\nEntity: %v", test.Data, err, entity)
		}
	}
}

func TestPayloadPersistence(t *testing.T) {
	settings := mock.Native{}
	settings.Configure()
	service := &Service{Log: &mock.LogService{Off: true}, Env: settings}
	service.Configure()
	api.Geocode = mock.Geocoder{}

	tests := []struct {
		Data string
	}{
		// Section: Identification
		{Data: "testdata/identification-birthdate.json"},
		{Data: "testdata/identification-birthplace.json"},
		{Data: "testdata/identification-contacts.json"},
		{Data: "testdata/identification-name.json"},
		{Data: "testdata/identification-othernames.json"},
		{Data: "testdata/identification-physical.json"},
		{Data: "testdata/identification-ssn.json"},
		{Data: "testdata/identification-comments.json"},

		// Section: Financial
		{Data: "testdata/financial-bankruptcy.json"},
		{Data: "testdata/financial-gambling.json"},
		{Data: "testdata/financial-taxes.json"},
		{Data: "testdata/financial-card.json"},
		{Data: "testdata/financial-credit.json"},
		{Data: "testdata/financial-delinquent.json"},
		{Data: "testdata/financial-nonpayment.json"},
		{Data: "testdata/financial-comments.json"},

		// Section: Your history
		{Data: "testdata/history-residence.json"},
		{Data: "testdata/history-employment.json"},
		{Data: "testdata/history-education.json"},
		{Data: "testdata/history-federal.json"},
		{Data: "testdata/history-comments.json"},

		// Section: Relationships
		{Data: "testdata/relationships-status-marital.json"},
		{Data: "testdata/relationships-status-cohabitant.json"},
		{Data: "testdata/relationships-people.json"},
		{Data: "testdata/relationships-relatives.json"},
		{Data: "testdata/relationships-comments.json"},

		// Section: Citizenship
		{Data: "testdata/citizenship-status.json"},
		{Data: "testdata/citizenship-multiple.json"},
		{Data: "testdata/citizenship-passports.json"},
		{Data: "testdata/citizenship-comments.json"},

		// Section: Military history
		{Data: "testdata/military-selective.json"},
		{Data: "testdata/military-history.json"},
		{Data: "testdata/military-foreign.json"},
		{Data: "testdata/military-disciplinary.json"},
		{Data: "testdata/military-comments.json"},

		// Section: Foreign activities
		{Data: "testdata/foreign-passport.json"},
		{Data: "testdata/foreign-contacts.json"},
		{Data: "testdata/foreign-travel.json"},
		{Data: "testdata/foreign-activities-benefits.json"},
		{Data: "testdata/foreign-activities-direct.json"},
		{Data: "testdata/foreign-activities-indirect.json"},
		{Data: "testdata/foreign-activities-realestate.json"},
		{Data: "testdata/foreign-activities-support.json"},
		{Data: "testdata/foreign-business-advice.json"},
		{Data: "testdata/foreign-business-conferences.json"},
		{Data: "testdata/foreign-business-contact.json"},
		{Data: "testdata/foreign-business-employment.json"},
		{Data: "testdata/foreign-business-family.json"},
		{Data: "testdata/foreign-business-political.json"},
		{Data: "testdata/foreign-business-sponsorship.json"},
		{Data: "testdata/foreign-business-ventures.json"},
		{Data: "testdata/foreign-business-voting.json"},
		{Data: "testdata/foreign-comments.json"},

		// Section: Substance use
		{Data: "testdata/substance-drug-usage.json"},
		{Data: "testdata/substance-drug-purchase.json"},
		{Data: "testdata/substance-drug-clearance.json"},
		{Data: "testdata/substance-drug-publicsafety.json"},
		{Data: "testdata/substance-drug-misuse.json"},
		{Data: "testdata/substance-drug-ordered.json"},
		{Data: "testdata/substance-drug-voluntary.json"},
		{Data: "testdata/substance-alcohol-negative.json"},
		{Data: "testdata/substance-alcohol-ordered.json"},
		{Data: "testdata/substance-alcohol-voluntary.json"},
		{Data: "testdata/substance-alcohol-additional.json"},
		{Data: "testdata/substance-comments.json"},

		// Section: Investigative and criminal history
		{Data: "testdata/legal-associations-activities-to-overthrow.json"},
		{Data: "testdata/legal-associations-advocating.json"},
		{Data: "testdata/legal-associations-engaged-in-terrorism.json"},
		{Data: "testdata/legal-associations-membership-overthrow.json"},
		{Data: "testdata/legal-associations-membership-violence-or-force.json"},
		{Data: "testdata/legal-associations-terrorism-association.json"},
		{Data: "testdata/legal-associations-terrorist-organization.json"},
		{Data: "testdata/legal-court.json"},
		{Data: "testdata/legal-investigations-debarred.json"},
		{Data: "testdata/legal-investigations-history.json"},
		{Data: "testdata/legal-investigations-revoked.json"},
		{Data: "testdata/legal-police-additionaloffenses.json"},
		{Data: "testdata/legal-police-domesticviolence.json"},
		{Data: "testdata/legal-police-offenses.json"},
		{Data: "testdata/legal-technology-manipulating.json"},
		{Data: "testdata/legal-technology-unauthorized.json"},
		{Data: "testdata/legal-technology-unlawful.json"},
		{Data: "testdata/legal-comments.json"},

		// Section: Psychological and emotional health
		{Data: "testdata/psychological-competence.json"},
		{Data: "testdata/psychological-consultations.json"},
		{Data: "testdata/psychological-hospitalizations.json"},
		{Data: "testdata/psychological-diagnoses.json"},
		{Data: "testdata/psychological-conditions.json"},
		{Data: "testdata/psychological-comments.json"},

		// Section: Submission
		{Data: "testdata/submission.json"},
	}

	for _, test := range tests {
		// Get the test data as a byte array
		raw, err := readBinaryData(test.Data)
		if err != nil {
			t.Fatalf("Failed to read binary data: %v", err)
		}

		// Deserialize the initial payload from a JSON structure
		payload := &api.Payload{}
		if err := payload.Unmarshal(raw); err != nil {
			t.Fatalf("Failed to deserialize JSON: %v\n:Error: %v\n", string(raw), err)
		}

		// Extract the entity interface of the payload and validate it
		entity, err := payload.Entity()
		if err != nil {
			t.Fatalf("Failed to unpackage the payload for [%s]: %v", test.Data, err)
		}

		account := 1
		if _, err := entity.Save(service, account); err != nil {
			t.Fatalf("Error saving [%s]: %v\n\nEntity: %v", test.Data, err, entity)
		}
		if _, err := entity.Get(service, account); err != nil {
			t.Fatalf("Error getting [%s]: %v\n\nEntity: %v", test.Data, err, entity)
		}
		if _, err := entity.Delete(service, account); err != nil {
			t.Fatalf("Error deleting [%s]: %v\n\nEntity: %v", test.Data, err, entity)
		}
	}
}

func TestApplication(t *testing.T) {
	account := 1
	settings := mock.Native{}
	settings.Configure()
	service := &Service{Log: &mock.LogService{Off: true}, Env: settings}
	service.Configure()

	js := api.Application(service, account, false)
	if len(js) == 0 {
		t.Fatal("Failed to get application state")
	}
}

func TestHash(t *testing.T) {
	account := 1
	settings := mock.Native{}
	settings.Configure()
	service := &Service{Log: &mock.LogService{Off: true}, Env: settings}
	service.Configure()

	sig := api.Hash(service, account)
	if len(sig) == 0 {
		t.Fatal("Failed to get application data hash")
	}
}

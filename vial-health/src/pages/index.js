'use client';

import '@mantine/core/styles.css';

import RootLayout from "./layout";

const API_URL = "https://055d8281-4c59-4576-9474-9b4840b30078.mock.pstmn.io/subjects";

export default function Home({ data }) {
    return (
        <RootLayout props={data}/>
    );
}

export async function getServerSideProps() {
    const headers = { "Content-Type": "application/json" };

    const res = await fetch(API_URL, {
        headers,
        method: "GET"
    });

    const json = await res.json();

    if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch API");
    }

    const processed_data = json.data.map((element) => {
        element.diagnosisDate = new Date(Date.parse(element.diagnosisDate)).toString();
        return element
    })

    return { props: { data: processed_data } };
};

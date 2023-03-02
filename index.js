import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

[
  //Today's Top Hits
  "37i9dQZF1DXcBWIGoYBM5M",
  //Pop Rising
  "37i9dQZF1DWUa8ZRTfalHk",
  //Hot Hits USA
  "37i9dQZF1DX0kbJZpiYdZl",
  //Just Good Music
  "37i9dQZF1DX0b1hHYQtJjp",
  //Teen Beats
  "37i9dQZF1DWWvvyNmW9V9a",
  //pov
  "37i9dQZF1DX01LszHBn1s8",
  //Poki's Picks
  "37i9dQZF1DX7pdfPOj4HBA",
  //Taylor Swift Complete Collection
  "4GtQVhGjAwcHFz82UKy3Ca",
].forEach(async (playlist) => {
  fs.writeFileSync(
    `./data/${playlist}.json`,
    JSON.stringify(await getPlaylist(playlist), null, 2)
  );
});

async function getPlaylist(id) {
  let data = [];
  const playlistPage = (
    await axios.get(`https://open.spotify.com/embed/playlist/${id}`)
  ).data;
  const $ = cheerio.load(playlistPage);
  $("li.ILBWJ5qBTswUE70J7XJx").each(async function () {
    let track = $(this);
    let trackName = track.find("h3.n9j4yH8fTb18m0l2QCJb").text();
    let artist = track.find("h4.QZ8JzsYF4qfkAAbajDIU").text();
    let length = track.find("div.qokoRz32JIxABTWdTy41").text();

    if (artist.startsWith("E")) artist = artist.substring(1);

    data.push({
      name: trackName,
      artist: artist,
      length: length,
    });
  });

  return {
    name: $(`a[data-encore-id="textLink"]`).contents().first().text(),
    author: $(`a[data-encore-id="textLink"]`).contents().last().text(),
    art: $(`div.dECpSYmWqPAhq6xqf2t3`)
      .attr("style")
      .replace("--image-src:url('", "")
      .replace("')", ""),
    length: data.length,
    tracks: data,
  };
}

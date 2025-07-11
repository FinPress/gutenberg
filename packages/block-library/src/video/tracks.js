export default function Tracks( { tracks = [] } ) {
	return tracks.map( ( track ) => {
		return <track key={ track.id } { ...track } />;
	} );
}



async function testFetch() {
  try {
    const res = await fetch('https://brandcollectionfabricasp.vendizap.com/');
    const text = await res.text();
    console.log("Size:", text.length);
    if (text.includes('__NEXT_DATA__')) {
      console.log("Has Next DATA");
    }
    if (text.includes('vendizap')) {
      console.log("Has vendizap string");
    }
    // write to test.html
    require('fs').writeFileSync('test.html', text);
    console.log('Saved to test.html');
  } catch (e) {
    console.error(e);
  }
}
testFetch();

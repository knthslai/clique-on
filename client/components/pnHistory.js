

export default function (pubnub, args, callback) {
  return function () {
    pubnub.history(
      {
        // search starting from this timetoken
        start: args.startToken,
        channel: args.channel,
        // false - search forwards through the timeline
        // true - search backwards through the timeline
        reverse: args.reverse,
        // limit number of messages per request to this value; default/max=100
        count: args.pagesize,
        // include each returned message's publish timetoken
        includeTimetoken: true,
        // prevents JS from truncating 17 digit timetokens
        stringifiedTimeToken: true
      },
      function (status, response) {
        // holds the accumulation of resulting messages across all iterations
        var results = args.results;
        // the retrieved messages from history for this iteration only
        var msgs = response.messages;
        // timetoken of the first message in response
        var firstTT = response.startTimeToken;
        // timetoken of the last message in response
        var lastTT = response.endTimeToken;
        // if no max results specified, default to 500
        args.max = !args.max ? 500 : args.max;

        if (msgs != undefined && msgs.length > 0) {
          // display each of the returned messages in browser console
          for (var i in msgs) {
            msg = msgs[i];
            console.log(msg.entry, msg.timetoken);
          }

          // first iteration, results is undefined, so initialize with first history results
          if (!results) results = msgs;
          // subsequent iterations, results has previous iterartions' results, so concat
          // but concat to end of results if reverse true, otherwise prepend to begining of results
          else args.reverse ? results = results.concat(msgs) : results = msgs.concat(results);
        }

        // show the total messages returned out of the max requested
        console.log(`total    : ` + results.length + `/` + args.max);

        // we keep asking for more messages if # messages returned by last request is the
        // same at the pagesize AND we still have reached the total number of messages requested
        // same as the opposit of !(msgs.length < pagesize || total == max)
        if (msgs.length == args.pagesize && results.length < args.max) {
          getMessages(
            {
              channel: args.channel, max: args.max, reverse: args.reverse,
              pagesize: args.pagesize, startToken: args.reverse ? lastTT : firstTT, results: results
            },
            callback);
        }
        // we've reached the end of possible messages to retrieve or hit the 'max' we asked for
        // so invoke the callback to the original caller of getMessages providing the total message results
        else callback(results);
      }
    );
  }
}
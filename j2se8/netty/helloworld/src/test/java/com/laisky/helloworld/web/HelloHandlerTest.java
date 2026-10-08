package com.laisky.helloworld.web;

import io.netty.channel.embedded.EmbeddedChannel;
import io.netty.handler.codec.http.*;
import io.netty.util.CharsetUtil;
import org.junit.Test;
import static org.junit.Assert.*;

public class HelloHandlerTest {
    @Test public void repeatedRequestsReturnIndependentPlainTextResponses() {
        EmbeddedChannel channel = new EmbeddedChannel(new HelloHandler());
        try {
            for (int i = 0; i < 2; i++) {
                FullHttpRequest request = new DefaultFullHttpRequest(
                    HttpVersion.HTTP_1_1, HttpMethod.GET, "/");
                channel.writeInbound(request);
                assertEquals(0, request.refCnt());
                FullHttpResponse response = channel.readOutbound();
                assertNotNull(response);
                try {
                    assertEquals(HttpResponseStatus.OK, response.status());
                    assertEquals("test", response.content().toString(CharsetUtil.UTF_8));
                    assertEquals("text/plain; charset=UTF-8",
                        response.headers().get(HttpHeaderNames.CONTENT_TYPE));
                    assertEquals(4, HttpUtil.getContentLength(response));
                    assertTrue(HttpUtil.isKeepAlive(response));
                } finally { response.release(); }
            }
        } finally { channel.finishAndReleaseAll(); }
    }

    @Test public void decoderRejectsOversizedHttpHeaders() {
        EmbeddedChannel channel = new EmbeddedChannel(new HttpRequestDecoder(4096, 64, 8192));
        try {
            String raw = "GET / HTTP/1.1\r\nHost: localhost\r\nX-Large: "
                + new String(new char[128]).replace('\0', 'a') + "\r\n\r\n";
            channel.writeInbound(io.netty.buffer.Unpooled.copiedBuffer(raw, CharsetUtil.US_ASCII));
            HttpRequest request = channel.readInbound();
            assertNotNull(request);
            assertTrue(request.decoderResult().isFailure());
        } finally { channel.finishAndReleaseAll(); }
    }
}

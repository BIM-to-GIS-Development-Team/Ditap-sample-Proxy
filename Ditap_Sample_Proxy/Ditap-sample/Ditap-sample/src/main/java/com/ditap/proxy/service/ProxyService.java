package com.ditap.proxy.service;

import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProxyService {
    private String geoserverUrl = "http://192.168.30.202:7000/geoserver";
    
    private final RestTemplate restTemplate;

    public ResponseEntity<byte[]> tileMap001(HttpServletRequest request) {
        String tileMatrix = request.getParameter("tilematrix");
        String tileRow = request.getParameter("tilerow");
        String tileCol = request.getParameter("tilecol");
        
        // 레이어, 스타일, 포맷, 그리드셋, 레벨, row, col
        return getTileMapImageFromGeoServer("jgh:temp_layer", "raster", "image/png", "EPSG:4326_JGH", tileMatrix, tileRow, tileCol);
    }

    private ResponseEntity<byte[]> getTileMapImageFromGeoServer(String layer, String style, String format, String tileMatrixSet,
                                                String tileMatrix, String tileRow, String tileCol) {
        StringBuilder params = new StringBuilder();
        params.append("/gwc/service/wmts/rest");
        params.append("/" + layer);
        params.append("/" + style);
        params.append("/" + tileMatrixSet);
        params.append("/" + tileMatrix);
        params.append("/" + tileRow);
        params.append("/" + tileCol);
        params.append("?format=" + format);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        URL url = null;
        try {
            url = new URL(geoserverUrl + params.toString());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        byte[] result = getStringFromMapImageResource(url.toString(), format);

        return new ResponseEntity<>(result, headers, HttpStatus.CREATED);
    }

    private byte[] getStringFromMapImageResource(String url, String format) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", format);

        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
        
        ResponseEntity<byte[]> response = null;
        
        try {
            response = restTemplate.exchange(url, HttpMethod.GET, entity, byte[].class);
        } catch (RestClientException e) {
        	// 이미지 파일을 가져오지 못할 경우
        	//e.printStackTrace();
            //File noTileFile = new File(noTilePath);
            //return FileUtils.readAllBytes(noTileFile);
        }
        
        return response.getBody();
    }
	
}

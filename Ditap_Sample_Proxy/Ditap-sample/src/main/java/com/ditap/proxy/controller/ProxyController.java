package com.ditap.proxy.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ditap.proxy.service.ProxyService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ProxyController {
    private final ProxyService proxyService;
    
    @RequestMapping(value = "/proxy/tileMap001.do", method = RequestMethod.GET)
    public ResponseEntity<byte[]> tileMap001(HttpServletRequest request) throws Exception {
    	ResponseEntity<byte[]> result = proxyService.tileMap001(request);
        return result;
    }
}
